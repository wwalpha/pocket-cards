import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TUserWordsKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_USER_WORDS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TUserWords) =>
  ({
    TableName: Environment.TABLE_NAME_USER_WORDS,
    Item: item,
  } as PutItemInput<Tables.TUserWords>);
