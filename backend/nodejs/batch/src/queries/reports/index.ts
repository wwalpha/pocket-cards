import { DynamoDB } from 'aws-sdk';
import { Environments } from '@utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TReports): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environments.TABLE_NAME_REPORTS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TReports) =>
  ({
    TableName: Environments.TABLE_NAME_REPORTS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
