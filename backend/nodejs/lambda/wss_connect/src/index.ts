import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { InvokeCommand, InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';
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
      const tasks: Promise<InvokeCommandOutput>[] = [];

      // 先生に通知
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
  } catch (err) {
    console.log(err);

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

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
