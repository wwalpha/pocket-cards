import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TReports): GetItemInput => ({
  TableName: Environments.TABLE_NAME_REPORTS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TReports) =>
  ({
    TableName: Environments.TABLE_NAME_REPORTS,
    Item: item,
  } as PutItemInput<Tables.TReports>);
