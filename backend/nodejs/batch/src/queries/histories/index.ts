import { DynamoDB } from 'aws-sdk';
import { Environments } from '@utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.THistoriesKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environments.TABLE_NAME_HISTORIES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.THistories) =>
  ({
    TableName: Environments.TABLE_NAME_HISTORIES,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
