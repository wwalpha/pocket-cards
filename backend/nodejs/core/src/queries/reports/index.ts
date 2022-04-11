import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TReports): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_REPORTS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TReports) =>
  ({
    TableName: Environment.TABLE_NAME_REPORTS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { query };
