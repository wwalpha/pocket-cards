import { ApiGatewayManagementApi } from 'aws-sdk';
import { WSSConnectionEvent } from 'typings';

export const handler = async (event: WSSConnectionEvent) => {
  const { domainName, connectionId, principalId } = event;

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
