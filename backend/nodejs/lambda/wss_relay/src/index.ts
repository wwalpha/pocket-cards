import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { WSSConnectionEvent } from 'typings';

export const handler = async (event: WSSConnectionEvent) => {
  const { domainName, connectionId, principalId, stage } = event;

  // sdk v3
  const apigateway = new ApiGatewayManagementApiClient({ endpoint: `https://${domainName}` });

  await apigateway.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(
        JSON.stringify({
          ON_LINE: principalId,
        })
      ),
    })
  );
};
