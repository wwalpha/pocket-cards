import { DynamoDB } from 'aws-sdk';
import { Environments } from '@consts';

/** グループ一覧を取得する */
export const byUserId = (userId: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  IndexName: 'gsiIdx1',
});
