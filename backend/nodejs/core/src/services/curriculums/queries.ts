import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TCurriculumsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TCurriculums): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Item: item,
  ReturnValues: 'UPDATED_NEW',
});

/** データ削除 */
export const del = (key: Tables.TCurriculumsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** カリキュラム一覧を取得する */
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

/** カリキュラム一覧を取得する */
export const byGroupId = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#groupId = :groupId',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
  },
  IndexName: 'gsiIdx2',
});
