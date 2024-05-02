import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  PostToConnectionCommandOutput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Tables, WSSConnectionEvent } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const FUNCTION_NAME = process.env.FUNCTION_NAME as string;
const AWS_REGION = process.env.AWS_REGION as string;

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
});
const docClient = DynamoDBDocumentClient.from(client);
const lambdaClient = new LambdaClient({
  region: AWS_REGION,
});

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;

  // sdk v3
  const apigateway = new ApiGatewayManagementApiClient({
    region: AWS_REGION,
    endpoint: `https://${domainName}`,
  });

  let statusCode = 200;
  let connections: Tables.TWSSConnections[] = [];

  try {
    // update self connection id
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME_CONNECTIONS,
        Item: {
          guardian: guardian,
          userId: principalId,
          connId: connectionId,
        } as Tables.TWSSConnections,
      })
    );

    // get all connections
    connections = await getConnections(guardian);

    const students = connections.filter((conn) => conn.userId !== conn.guardian);
    const teachers = connections.filter((conn) => conn.userId === conn.guardian);

    // 生徒がログインした場合
    if (students.length !== 0) {
      const tasks: Promise<PostToConnectionCommandOutput>[] = [];

      teachers.forEach((teacher) => {
        students.forEach((student) => {
          tasks.push(
            lambdaClient.send(
              new InvokeCommand({
                FunctionName: FUNCTION_NAME,
                InvocationType: 'Event',
                Payload: Buffer.from(
                  JSON.stringify({
                    connectionId: teacher.connId,
                    domainName: domainName,
                    principalId: student.userId,
                  } as WSSConnectionEvent)
                ),
              })
            )
          );
        });
      });

      await Promise.all(tasks);
    }

    // 生徒の場合
    // if (principalId !== guardian) {
    //   // 先生のみに通知する
    //   connections = connections.filter((conn) => conn.guardian === conn.userId);

    //   await Promise.all(
    //     connections.map((conn) =>
    //       apigateway.send(
    //         new PostToConnectionCommand({
    //           ConnectionId: conn.connId,
    //           Data: Buffer.from(
    //             JSON.stringify({
    //               ON_LINE: principalId,
    //             })
    //           ),
    //         })
    //       )
    //     )
    //   );
    // }

    // connections = connections.filter((conn) => conn.userId !== conn.guardian);

    // notify all connections
    // await Promise.all(
    //   connections
    //     .filter((conn) => conn.userId !== conn.guardian)
    //     .map((conn) =>
    //       apigateway.send(
    //         new PostToConnectionCommand({
    //           ConnectionId: conn.connId,
    //           Data: Buffer.from(
    //             JSON.stringify({
    //               ON_LINE: principalId,
    //             })
    //           ),
    //         })
    //       )
    //     )
    // );
  } catch (err) {
    console.log(err);
    const error = err as unknown;

    // @ts-ignore
    if (error.code === 'GoneException') {
      await clearConnections(connections);
    }

    statusCode = 500;
  }

  return {
    statusCode,
  };
};

const getConnections = async (userId: string): Promise<Tables.TWSSConnections[]> => {
  const results = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME_CONNECTIONS,
      KeyConditionExpression: '#guardian = :guardian',
      ExpressionAttributeNames: {
        '#guardian': 'guardian',
      },
      ExpressionAttributeValues: {
        ':guardian': userId,
      },
      ConsistentRead: true,
    })
  );

  if (!results.Items) {
    return [];
  }

  const items = results.Items as Tables.TWSSConnections[];

  // remove self
  return items;
};

const clearConnections = async (connections: Tables.TWSSConnections[]): Promise<void> => {
  // remove all records
  const tasks = connections.map((item) =>
    docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME_CONNECTIONS,
        Key: {
          guardian: item.guardian,
          userId: item.userId,
        },
      })
    )
  );

  await Promise.all(tasks);
};
interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
