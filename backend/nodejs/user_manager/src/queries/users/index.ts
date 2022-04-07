import { DynamoDB } from 'aws-sdk';
import { Environments } from '../../consts';
import { Tables } from 'typings';
import * as update from './update';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    Key: {
      id,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ更新 */
export const put = (item: Tables.TUsers) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { update };
