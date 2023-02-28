import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@utils';
import { Tables } from 'typings';
export * as query from './query';

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
