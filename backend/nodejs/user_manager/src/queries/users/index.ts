import { Environments } from '../../consts';
import { Tables } from 'typings';
import * as update from './update';
import * as query from './query';
import { GetItemInput, PutItemInput } from '@alphax/dynamodb';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    Key: {
      id,
    },
  } as GetItemInput);

/** データ更新 */
export const put = (item: Tables.TUsers) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    Item: item,
  } as PutItemInput<Tables.TUsers>);

export { update, query };
