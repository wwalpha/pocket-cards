import { ApiGatewayManagementApi, AWSError, DynamoDB, Lambda } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables, WSSConnectionEvent } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const FUNCTION_NAME = process.env.FUNCTION_NAME as string;

const client = new DynamoDB.DocumentClient();
const lambda = new Lambda();

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;
  const apigateway = new ApiGatewayManagementApi({ endpoint: domainName });

  let statusCode = 200;

  let connections: Tables.TWSSConnections[] = [];

  try {
    // get all connections
    connections = await getConnections(guardian);

    // update self connection id
    await client
      .put({
        TableName: TABLE_NAME_CONNECTIONS,
        Item: {
          guardian: guardian,
          userId: principalId,
          connId: connectionId,
        } as Tables.TWSSConnections,
      })
      .promise();

    // 一括実行
    await Promise.all(
      connections.map((item) =>
        apigateway
          .postToConnection({
            ConnectionId: item.connId,
            Data: JSON.stringify({
              ON_LINE: principalId,
            }),
          })
          .promise()
      )
    );

    // 保護者且つ、対象者すでにログインの場合
    if (principalId === guardian && connections.length > 0) {
      await lambda
        .invoke({
          FunctionName: FUNCTION_NAME,
          InvocationType: 'Event',
          Payload: JSON.stringify({
            connectionId: connectionId,
            domainName: domainName,
            principalId: connections[0].userId,
          } as WSSConnectionEvent),
        })
        .promise();
    }
  } catch (err) {
    console.log(err);

    const error = err as unknown as AWSError;

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
  const results = await client
    .query({
      TableName: TABLE_NAME_CONNECTIONS,
      KeyConditionExpression: '#guardian = :guardian',
      ExpressionAttributeNames: {
        '#guardian': 'guardian',
      },
      ExpressionAttributeValues: {
        ':guardian': userId,
      },
    })
    .promise();

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
    client
      .delete({
        TableName: TABLE_NAME_CONNECTIONS,
        Key: {
          guardian: item.guardian,
          userId: item.userId,
        },
      })
      .promise()
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
