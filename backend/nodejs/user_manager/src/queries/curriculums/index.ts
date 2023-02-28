import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@consts';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TCurriculumsKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TCurriculums): PutItemInput<Tables.TCurriculums> => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TCurriculumsKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Key: key,
});

export { query };
