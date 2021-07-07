import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as update from './update';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environment.TABLE_USERS,
    Key: {
      id,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ更新 */
export const put = (item: Tables.TUsers) =>
  ({
    TableName: Environment.TABLE_USERS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { update };
