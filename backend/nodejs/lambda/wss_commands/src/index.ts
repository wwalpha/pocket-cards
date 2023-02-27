import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;

const client = DynamoDBDocument.from(
  new DynamoDB({
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
  const apigateway = new ApiGatewayManagementApiClient({ endpoint: domainName });

  const connections = await getConnections(authorizer.principalId, connectionId);

  await Promise.all(
    connections.map((item) => {
      const cmd = new PostToConnectionCommand({
        ConnectionId: item.connId,
        Data: Buffer.from(JSON.stringify(request)),
      });

      return apigateway.send(cmd);
    })
  );

  return {
    statusCode: 200,
  };
};

const getConnections = async (userId: string, connectionId: string) => {
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
