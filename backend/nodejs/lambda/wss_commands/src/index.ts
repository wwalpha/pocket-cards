import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyWebsocketEventV2, context: any): Promise<any> => {
  console.log(context);
  const { connectionId, domainName, stage } = event.requestContext;

  const apigateway = new ApiGatewayManagementApi({ endpoint: `${domainName}/${stage}` });

  console.log(event.requestContext);
  // await apigateway
  //   .postToConnection({
  //     ConnectionId: connectionId as string,
  //     Data: 'Hi Client',
  //   })
  //   .promise();

  return {
    statusCode: 200,
  };
};
