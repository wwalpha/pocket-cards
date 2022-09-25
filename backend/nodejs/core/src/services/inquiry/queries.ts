import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TInquiryKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TInquiry): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TInquiryKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_INQUIRY,
  Key: key,
});
