import { DynamoDB } from 'aws-sdk';
import { Environments } from '@utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TAccuracyKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TAccuracy): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TAccuracyKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Key: key,
});
