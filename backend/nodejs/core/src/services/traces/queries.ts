import { PutItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ登録 */
export const put = (item: Tables.TTraces): PutItemInput<Tables.TTraces> => ({
  TableName: Environment.TABLE_NAME_TRACES,
  Item: item,
});
