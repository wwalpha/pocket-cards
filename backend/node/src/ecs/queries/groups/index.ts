import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { API, Table } from 'typings';
import * as query from './query';
import * as update from './update';

/** データ取得 */
export const get = (key: Table.GroupsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: Table.TGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: Table.GroupsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_GROUPS,
  Key: {
    id: key.id,
    userId: key.userId,
  },
});

export { query, update };
