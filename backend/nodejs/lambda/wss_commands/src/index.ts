import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const client = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  // validation
  if (!event.body) {
    return { statusCode: 400 };
  }

  const { connectionId, domainName, stage, authorizer } = event.requestContext;
  const request = JSON.parse(event.body) as RequestBody;
  const apigateway = new ApiGatewayManagementApi({ endpoint: domainName });

  const connections = await getConnections(authorizer.principalId, connectionId);

  await Promise.all(
    connections.map((item) =>
      apigateway
        .postToConnection({
          ConnectionId: item.connId,
          Data: JSON.stringify(request),
        })
        .promise()
    )
  );

  return {
    statusCode: 200,
  };
};

const getConnections = async (userId: string, connectionId: string) => {
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
  return items.filter((item) => item.connId !== connectionId);
};

interface RequestBody {
  command: 'SHOW_NEXT' | 'SHOW_ANSWER';
  payload?: string;
}

interface TAuthorizer {
  principalId: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
