import { DynamoDB } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS as string;
const client = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { principalId } = event.requestContext.authorizer;
  let statusCode = 200;

  // get guardian id
  const guardian = await getGuardian(principalId);

  // guardian not found
  if (!guardian) {
    return { statusCode };
  }

  try {
    await client
      .delete({
        TableName: TABLE_NAME_CONNECTIONS,
        Key: {
          guardian: guardian,
          userId: principalId,
        } as Tables.TWSSConnectionsKey,
      })
      .promise();
  } catch (err) {
    console.log(err);
  }

  return {
    statusCode,
  };
};

/** get user's guardian id */
const getGuardian = async (userId: string) => {
  const result = await client
    .get({
      TableName: TABLE_NAME_USERS,
      Key: {
        id: userId,
      } as Tables.TUsersKey,
    })
    .promise();

  if (!result.Item) {
    return undefined;
  }

  // ユーザ情報
  const userInfo = result.Item as Tables.TUsers;

  // 教師ある場合は、教師を返す
  return userInfo.teacher ? userInfo.teacher : userInfo.id;
};

interface TAuthorizer {
  principalId: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
