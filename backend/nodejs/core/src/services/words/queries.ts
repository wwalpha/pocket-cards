import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TWordMasterKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_WORD_MASTER,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TWordMaster) =>
  ({
    TableName: Environment.TABLE_NAME_WORD_MASTER,
    Item: item,
  } as PutItemInput<Tables.TWordMaster>);

/** データ取得 */
export const getFromIgnore = (key: Tables.TWordIgnoreKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_WORD_IGNORE,
  Key: key,
});

/** データ登録 */
export const putIgnore = (item: Tables.TWordIgnore) =>
  ({
    TableName: Environment.TABLE_NAME_WORD_IGNORE,
    Item: item,
  } as PutItemInput<Tables.TWordIgnore>);
