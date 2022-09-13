import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME as string;
const client = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyWebsocketEventV2, context: any): Promise<any> => {
  const { connectionId } = event.requestContext;
  const { userId } = context;
  let statusCode = 200;

  try {
    await client
      .delete({
        TableName: TABLE_NAME,
        Key: {
          id: userId,
          connId: connectionId,
        },
      })
      .promise();
  } catch (err) {
    console.log(err);
  }

  return {
    statusCode,
  };
};
