import { DynamoDB } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME as string;
const client = new DynamoDB.DocumentClient();

interface TAuthorizer {
  principalId: string;
  integrationLatency: number;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId } = event.requestContext;
  const { principalId } = event.requestContext.authorizer;
  let statusCode = 200;

  try {
    await client
      .put({
        TableName: TABLE_NAME,
        Item: {
          id: principalId,
          connId: connectionId,
        },
      })
      .promise();
  } catch (err) {
    console.log(err);
    statusCode = 500;
  }

  return {
    statusCode,
  };
};
