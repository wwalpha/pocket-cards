import { DynamoDB } from 'aws-sdk';
import { Environments } from '@consts';
import { Tables } from 'typings';
import * as query from './query';
import * as update from './update';

/** データ取得 */
export const get = (key: Tables.TGroupsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TGroupsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: {
    id: key.id,
  },
});

export { query, update };
