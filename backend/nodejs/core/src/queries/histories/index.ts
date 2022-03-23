import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
export * as query from './query';

/** データ取得 */
export const get = (key: Tables.THistoriesKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_HISTORIES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.THistories) =>
  ({
    TableName: Environment.TABLE_NAME_HISTORIES,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
