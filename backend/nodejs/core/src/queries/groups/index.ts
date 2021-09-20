import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as query from './query';
import * as update from './update';

/** データ取得 */
export const get = (key: Tables.GroupsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TGroups): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.GroupsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: {
    id: key.id,
    userId: key.userId,
  },
});

export { query, update };
