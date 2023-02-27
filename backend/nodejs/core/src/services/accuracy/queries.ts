import { GetItemInput, PutItemInput, DeleteItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TAccuracyKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_ACCURACY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TAccuracy): PutItemInput<Tables.TAccuracy> => ({
  TableName: Environment.TABLE_NAME_ACCURACY,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TAccuracyKey): DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_ACCURACY,
  Key: key,
});
