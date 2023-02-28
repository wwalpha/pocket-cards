import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const client = DynamoDBDocument.from(new DynamoDB({}));

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;
  const apigateway = new ApiGatewayManagementApiClient({ endpoint: domainName });

  let statusCode = 200;
  const connections = await getConnections(guardian, connectionId);

  try {
    await client.delete({
      TableName: TABLE_NAME_CONNECTIONS,
      Key: {
        guardian: guardian,
        userId: principalId,
      } as Tables.TWSSConnectionsKey,
    });

    await Promise.all(
      connections.map((item) =>
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

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
