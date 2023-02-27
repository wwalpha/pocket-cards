import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@utils';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TLearningKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TLearning): PutItemInput<Tables.TLearning> => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TLearningKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  Key: key,
});

export { query };
