import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GoneException,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables, WSSConnectionEvent } from 'typings';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const FUNCTION_NAME = process.env.FUNCTION_NAME as string;

const client = DynamoDBDocument.from(
  new DynamoDB({
    region: process.env.AWS_DEFAULT_REGION,
  })
);
const lambda = new LambdaClient({
  region: process.env.AWS_DEFAULT_REGION,
});

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;
  const apigateway = new ApiGatewayManagementApiClient({ endpoint: domainName });

  let statusCode = 200;

  let connections: Tables.TWSSConnections[] = [];

  try {
    // get all connections
    connections = await getConnections(guardian);

    // update self connection id
    await client.put({
      TableName: TABLE_NAME_CONNECTIONS,
      Item: {
        guardian: guardian,
        userId: principalId,
        connId: connectionId,
      } as Tables.TWSSConnections,
    });

    // 一括実行
    await Promise.all(
      connections.map((item) => {
        const cmd = new PostToConnectionCommand({
          ConnectionId: item.connId,
          Data: Buffer.from(
            JSON.stringify({
              ON_LINE: principalId,
            })
          ),
        });

        return apigateway.send(cmd);
      })
    );

    // 保護者且つ、対象者すでにログインの場合
    if (principalId === guardian && connections.length > 0) {
      const cmd = new InvokeCommand({
        FunctionName: FUNCTION_NAME,
        InvocationType: 'Event',
        Payload: Buffer.from(
          JSON.stringify({
            connectionId: connectionId,
            domainName: domainName,
            principalId: connections[0].userId,
          } as WSSConnectionEvent)
        ),
      });

      await lambda.send(cmd);
    }
  } catch (err) {
    console.log(err);

    if (err instanceof GoneException) {
      await clearConnections(connections);
    }

    statusCode = 500;
  }

  return {
    statusCode,
  };
};

const getConnections = async (userId: string): Promise<Tables.TWSSConnections[]> => {
  const results = await client.query({
    TableName: TABLE_NAME_CONNECTIONS,
    KeyConditionExpression: '#guardian = :guardian',
    ExpressionAttributeNames: {
      '#guardian': 'guardian',
    },
    ExpressionAttributeValues: {
      ':guardian': userId,
    },
  });
  if (!results.Items) {
    return [];
  }

  const items = results.Items as Tables.TWSSConnections[];

  // return client connections
  return items;
};

const clearConnections = async (connections: Tables.TWSSConnections[]): Promise<void> => {
  // remove all records
  const tasks = connections.map((item) =>
    client.delete({
      TableName: TABLE_NAME_CONNECTIONS,
      Key: {
        guardian: item.guardian,
        userId: item.userId,
      },
    })
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
