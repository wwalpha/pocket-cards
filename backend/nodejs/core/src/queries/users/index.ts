import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as update from './update';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environment.TABLE_NAME_USERS,
    Key: {
      id,
    },
  } as GetItemInput);

/** データ更新 */
export const put = (item: Tables.TUsers) =>
  ({
    TableName: Environment.TABLE_NAME_USERS,
    Item: item,
  } as PutItemInput<Tables.TUsers>);

export { update };
