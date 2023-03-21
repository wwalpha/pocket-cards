import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyWebsocketEventV2WithRequestContext,
} from 'aws-lambda';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

const TABLE_NAME_CONNECTIONS = process.env.TABLE_NAME_CONNECTIONS as string;
const AWS_REGION = process.env.AWS_REGION as string;

// sdk v3
// const client = DynamoDBDocument.from(
//   new DynamoDB({
//     region: AWS_REGION,
//   })
// );
const client = new DynamoDB.DocumentClient({
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
  //   endpoint: `https://${domainName}/${stage}/`,
  // });

  const apigateway = new ApiGatewayManagementApi({
    region: AWS_REGION,
    endpoint: domainName,
  });

  let statusCode = 200;
  const connections = await getConnections(guardian, connectionId);

  try {
    await client
      .delete({
        TableName: TABLE_NAME_CONNECTIONS,
        Key: {
          guardian: guardian,
          userId: principalId,
        } as Tables.TWSSConnectionsKey,
      })
      .promise();

    await Promise.all(
      connections.map((item) =>
        // sdk v3
        // apigateway.send(
        //   new PostToConnectionCommand({
        //     ConnectionId: item.connId,
        //     Data: Buffer.from(
        //       JSON.stringify({
        //         OFF_LINE: principalId,
        //       })
        //     ),
        //   })
        // )
        apigateway
          .postToConnection({
            ConnectionId: item.connId,
            Data: JSON.stringify({
              OFF_LINE: principalId,
            }),
          })
          .promise()
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

interface TAuthorizer {
  principalId: string;
  guardian: string;
}

interface ContextV2WithAuthorizer extends APIGatewayEventWebsocketRequestContextV2 {
  authorizer: TAuthorizer;
}
