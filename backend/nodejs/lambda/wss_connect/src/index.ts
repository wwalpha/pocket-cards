import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;

const client = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;
  const apigateway = new ApiGatewayManagementApi({ endpoint: domainName });

  let statusCode = 200;

  const connections = await getConnections(guardian);

  try {
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

    const tasks = connections.map((item) =>
      apigateway
        .postToConnection({
          ConnectionId: item.connId,
          Data: JSON.stringify({
            ON_LINE: principalId,
          }),
        })
        .promise()
    );

    // 保護者且つ、対象者すでにログインの場合
    if (principalId === guardian && connections.length > 0) {
      tasks.push(
        apigateway
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              ON_LINE: connections[0].userId,
            }),
          })
          .promise()
      );
    }

    // 一括実行
    await Promise.all(tasks);
  } catch (err) {
    console.log(err);
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

/** get user's guardian id */
// const getGuardian = async (userId: string) => {
//   const result = await client
//     .get({
//       TableName: TABLE_NAME_USERS,
//       Key: {
//         id: userId,
//       } as Tables.TUsersKey,
//     })
//     .promise();

//   if (!result.Item) {
//     return undefined;
//   }

//   // ユーザ情報
//   const userInfo = result.Item as Tables.TUsers;

//   // 教師ある場合は、教師を返す
//   return userInfo.teacher ? userInfo.teacher : userInfo.id;
// };

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
