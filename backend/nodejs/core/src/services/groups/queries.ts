import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TGroupsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TGroupsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: {
    id: key.id,
  },
});

/** 科目別学年別のグループ一覧 */
export const byGrade = (subject: string, grade: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  KeyConditionExpression: '#subject = :subject',
  FilterExpression: '#grade = :grade',
  ExpressionAttributeNames: {
    '#subject': 'subject',
    '#grade': 'grade',
  },
  ExpressionAttributeValues: {
    ':subject': subject,
    ':grade': grade,
  },
  IndexName: 'gsiIdx1',
});

export const plusCount = (key: Tables.TGroupsKey, count: number): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count + :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});

export const minusCount = (key: Tables.TGroupsKey, count: number): DynamoDB.DocumentClient.Update => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count - :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
