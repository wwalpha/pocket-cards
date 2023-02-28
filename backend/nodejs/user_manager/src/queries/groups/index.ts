import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@consts';
import { Tables } from 'typings';
import * as query from './query';
import * as update from './update';

/** データ取得 */
export const get = (key: Tables.TGroupsKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TGroups): PutItemInput<Tables.TGroups> => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TGroupsKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: {
    id: key.id,
  },
});

export { query, update };
