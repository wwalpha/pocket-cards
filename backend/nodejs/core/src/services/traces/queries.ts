// TODO: NEED TO REMOVE
/**
 * グループIDより、ユーザIDを検索する
 */
// export const byUserId = (userId: string, timestamp: string, groupId?: string): DynamoDB.DocumentClient.QueryInput => {
//   const query: DynamoDB.DocumentClient.QueryInput = {
//     TableName: Environment.TABLE_NAME_TRACES,
//     KeyConditionExpression: '#userId = :userId and begins_with(#timestamp, :timestamp)',
//     ExpressionAttributeNames: {
//       '#userId': 'userId',
//       '#timestamp': 'timestamp',
//     },
//     ExpressionAttributeValues: {
//       ':userId': userId,
//       ':timestamp': timestamp,
//     },
//     IndexName: 'gsiIdx1',
//   };

//   // if has value
//   if (groupId) {
//     query.FilterExpression = '#groupId = :groupId';
//     query.ExpressionAttributeNames = {
//       ...query.ExpressionAttributeNames,
//       '#groupId': 'groupId',
//     };
//     query.ExpressionAttributeValues = {
//       ...query.ExpressionAttributeValues,
//       ':groupId': groupId,
//     };
//   }

//   return query;
// };
