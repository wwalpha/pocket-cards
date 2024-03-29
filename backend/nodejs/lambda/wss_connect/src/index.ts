import { ApiGatewayManagementApi, AWSError, DynamoDB, Lambda } from 'aws-sdk';
import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { Tables, WSSConnectionEvent } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const FUNCTION_NAME = process.env.FUNCTION_NAME as string;
const AWS_REGION = process.env.AWS_REGION as string;

const client = new DynamoDB.DocumentClient({
  region: AWS_REGION,
});

const lambda = new Lambda({
  region: AWS_REGION,
});

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2WithRequestContext<ContextV2WithAuthorizer>
): Promise<any> => {
  const { connectionId, domainName, stage } = event.requestContext;
  const { principalId, guardian } = event.requestContext.authorizer;

  // sdk v3
  // const apigateway = new ApiGatewayManagementApiClient({
  //   region: AWS_REGION,
  //   endpoint: `https://${domainName}/${stage}`,
  // });
  const apigateway = new ApiGatewayManagementApi({
    region: AWS_REGION,
    endpoint: domainName,
  });

  let statusCode = 200;

  let connections: Tables.TWSSConnections[] = [];

  try {
    // get all connections
    connections = await getConnections(guardian);

    // update self connection id
    await client
      .put({
        TableName: TABLE_NAME_CONNECTIONS,
        Item: {
          guardian: guardian,
          userId: principalId,
          connId: connectionId,
        } as Tables.TWSSConnections,
      })
      .promise();

    // 一括実行
    await Promise.all(
      connections.map((item) => {
        // sdk v3
        // const cmd = new PostToConnectionCommand({
        //   ConnectionId: item.connId,
        //   Data: Buffer.from(
        //     JSON.stringify({
        //       ON_LINE: principalId,
        //     })
        //   ),
        // });
        // return apigateway.send(cmd);

        return apigateway
          .postToConnection({
            ConnectionId: item.connId,
            Data: JSON.stringify({
              ON_LINE: principalId,
            }),
          })
          .promise();
      })
    );

    // 保護者且つ、対象者すでにログインの場合
    if (principalId === guardian && connections.length > 0) {
      // sdk v3
      // const cmd = new InvokeCommand({
      //   FunctionName: FUNCTION_NAME,
      //   InvocationType: 'Event',
      //   Payload: Buffer.from(
      //     JSON.stringify({
      //       connectionId: connectionId,
      //       domainName: domainName,
      //       principalId: connections[0].userId,
      //       stage: stage,
      //     } as WSSConnectionEvent)
      //   ),
      // });
      // await lambda.send(cmd);
      await lambda
        .invoke({
          FunctionName: FUNCTION_NAME,
          InvocationType: 'Event',
          Payload: JSON.stringify({
            connectionId: connectionId,
            domainName: domainName,
            principalId: connections[0].userId,
            stage: stage,
          } as WSSConnectionEvent),
        })
        .promise();
    }
  } catch (err) {
    console.log(err);
    const error = err as AWSError;

    if (error.code === 'GoneException') {
      await clearConnections(connections);
    }

    statusCode = 500;
  }

  return {
    statusCode,
  };
};

const getConnections = async (userId: string): Promise<Tables.TWSSConnections[]> => {
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
  return items;
};

const clearConnections = async (connections: Tables.TWSSConnections[]): Promise<void> => {
  // remove all records
  const tasks = connections.map((item) =>
    client.delete({
      TableName: TABLE_NAME_CONNECTIONS,
      Key: {
        guardian: item.guardian,
        userId: item.userId,
      },
    })
  );

  await Promise.all(tasks);
};

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
