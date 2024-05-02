import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';

import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const AWS_REGION = process.env.AWS_REGION as string;

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
  })
);

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  // validation
  if (!event.body) {
    return { statusCode: 400 };
  }

  const { connectionId, domainName, authorizer } = event.requestContext;
  const request = JSON.parse(event.body) as RequestBody;

  // send message to all clients
  const apigateway = new ApiGatewayManagementApiClient({
    region: AWS_REGION,
    endpoint: `https://${domainName}`,
  });

  const connections = await getConnections(authorizer.principalId, connectionId);

  await Promise.all(
    connections.map((item) =>
      apigateway.send(
        new PostToConnectionCommand({
          ConnectionId: item.connId,
          Data: JSON.stringify(request),
        })
      )
    )
  );

  return {
    statusCode: 200,
  };
};

const getConnections = async (userId: string, connectionId: string) => {
  const results = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME_CONNECTIONS,
      KeyConditionExpression: '#guardian = :guardian',
      ExpressionAttributeNames: {
        '#guardian': 'guardian',
      },
      ExpressionAttributeValues: {
        ':guardian': userId,
      },
    })
  );

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
