import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/** グループ一覧を取得する */
export const byUserId = (userId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  IndexName: 'gsiIdx1',
});
