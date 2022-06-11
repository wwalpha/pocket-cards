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
export const byGroupId = (groupId: string, userId?: string): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_CURRICULUMS,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx2',
  };

  // range key
  if (!userId) {
    query.KeyConditionExpression = '#groupId = :groupId AND #userId = :userId';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#userId': 'userId',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':userId': userId,
    };
  }

  return query;
};

/** カリキュラム一覧を取得する（未学習のみ） */
export const byUnlearned = (guardian: string, userId: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#guardian = :guardian',
  FilterExpression: '#userId = :userId and #unlearned <> :unlearned and #subject = :subject',
  ExpressionAttributeNames: {
    '#guardian': 'guardian',
    '#userId': 'userId',
    '#subject': 'subject',
    '#unlearned': 'unlearned',
  },
  ExpressionAttributeValues: {
    ':guardian': guardian,
    ':userId': userId,
    ':subject': subject,
    ':unlearned': 0,
  },
  IndexName: 'gsiIdx1',
});

/** カリキュラム一覧を取得する（未学習のみ） */
export const updateUnlearned = (
  key: Tables.TCurriculumsKey,
  count: number
): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
  UpdateExpression: 'set #unlearned = #unlearned + :nums',
  ExpressionAttributeNames: {
    '#unlearned': 'unlearned',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
