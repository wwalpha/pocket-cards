import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const AWS_REGION = process.env.AWS_REGION as string;

// sdk v3
const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
  })
);

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName, stage } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;

  // sdk v3
  const apigateway = new ApiGatewayManagementApiClient({
    region: AWS_REGION,
    endpoint: `https://${domainName}`,
  });

  let statusCode = 200;
  const connections = await getConnections(guardian, connectionId);

  try {
    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME_CONNECTIONS,
        Key: {
          guardian: guardian,
          userId: principalId,
        } as Tables.TWSSConnectionsKey,
      })
    );

    await Promise.all(
      connections.map((item) =>
        // sdk v3
        apigateway.send(
          new PostToConnectionCommand({
            ConnectionId: item.connId,
            Data: Buffer.from(
              JSON.stringify({
                OFF_LINE: principalId,
              })
            ),
          })
        )
      )
    );
  } catch (err) {
    console.log(err);
  }

  return {
    statusCode,
  };
};

const getConnections = async (userId: string, connectionId: string): Promise<Tables.TWSSConnections[]> => {
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

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
