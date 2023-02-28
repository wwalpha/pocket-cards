import { QueryInput } from '@alphax/dynamodb';
import { Environments } from '@consts';

/** カリキュラム一覧を取得する */
export const byGuardian = (guardian: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#guardian = :guardian',
  ExpressionAttributeNames: {
    '#guardian': 'guardian',
  },
  ExpressionAttributeValues: {
    ':guardian': guardian,
  },
  IndexName: 'gsiIdx1',
});

/** カリキュラム一覧を取得する */
export const byGroupId = (groupId: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#groupId = :groupId',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
  },
  IndexName: 'gsiIdx2',
});
