// TODO: NEED TO REMOVE
// export const byUserId = (userId: string, timestamp: string) =>
//   ({
//     TableName: Environment.TABLE_NAME_TRACES,
//     ProjectionExpression: 'qid, #timestamp, subject, timesAfter',
//     KeyConditionExpression: '#userId = :userId and #timestamp <= :timestamp',
//     ExpressionAttributeNames: {
//       '#userId': 'userId',
//       '#timestamp': 'timestamp',
//     },
//     ExpressionAttributeValues: {
//       ':userId': userId,
//       ':timestamp': timestamp,
//     },
//     IndexName: 'gsiIdx1',
//   } as DynamoDB.DocumentClient.QueryInput);
