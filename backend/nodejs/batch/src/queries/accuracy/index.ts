import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TAccuracyKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TAccuracy): PutItemInput<Tables.TAccuracy> => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TAccuracyKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_ACCURACY,
  Key: key,
});
