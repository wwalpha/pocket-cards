import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TInquiryKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TInquiry): PutItemInput<Tables.TInquiry> => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TInquiryKey): DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Key: key,
});
