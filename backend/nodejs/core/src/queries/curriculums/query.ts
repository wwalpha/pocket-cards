import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/** グループ一覧を取得する */
export const byGuardian = (guardian: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#guardian = :guardian',
  ExpressionAttributeNames: {
    '#guardian': 'guardian',
  },
  ExpressionAttributeValues: {
    ':guardian': guardian,
  },
  IndexName: 'gsiIdx1',
});
