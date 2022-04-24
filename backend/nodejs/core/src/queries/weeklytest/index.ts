import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
export * as query from './query';

/** データ取得 */
export const get = (key: Tables.TWeeklyTestKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_TEST,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TweeklyTest) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_TEST,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

/** データ削除 */
export const del = (key: Tables.TWeeklyTestKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_TEST,
  Key: key,
});
