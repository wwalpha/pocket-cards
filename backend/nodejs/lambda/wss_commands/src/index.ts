import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';

import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const AWS_REGION = process.env.AWS_REGION as string;

const client = new DynamoDB.DocumentClient({
  region: process.env.AWS_DEFAULT_REGION,
});

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  // validation
  if (!event.body) {
    return { statusCode: 400 };
  }

  const { connectionId, domainName, authorizer, stage } = event.requestContext;
  const request = JSON.parse(event.body) as RequestBody;

  // sdk v3
  // const apigateway = new ApiGatewayManagementApiClient({
  //   region: AWS_REGION,
  //   endpoint: `wss://${domainName}/${stage}`,
  // });

  const apigateway = new ApiGatewayManagementApi({
    region: AWS_REGION,
    endpoint: domainName,
  });

  const connections = await getConnections(authorizer.principalId, connectionId);

  // sdk v3
  // await Promise.all(
  //   connections.map((item) => {
  //     const cmd = new {
  //       ConnectionId: item.connId,
  //       Data: Buffer.from(JSON.stringify(request)),
  //     }();

  //     return apigateway.send(cmd);
  //   })
  // );

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
