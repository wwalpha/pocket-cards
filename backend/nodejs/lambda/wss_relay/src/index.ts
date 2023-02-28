import { ApiGatewayManagementApi } from 'aws-sdk';
import { WSSConnectionEvent } from 'typings';

export const handler = async (event: WSSConnectionEvent) => {
  const { domainName, connectionId, principalId, stage } = event;

  // sdk v3
  // const apigateway = new ApiGatewayManagementApiClient({ endpoint: `https://${domainName}/${stage}` });

  // await apigateway.send(
  //   new PostToConnectionCommand({
  //     ConnectionId: connectionId,
  //     Data: Buffer.from(
  //       JSON.stringify({
  //         ON_LINE: principalId,
  //       })
  //     ),
  //   })
  // );
  const apigateway = new ApiGatewayManagementApi({ endpoint: domainName });

  await apigateway
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        ON_LINE: principalId,
      }),
    })
    .promise();
};
