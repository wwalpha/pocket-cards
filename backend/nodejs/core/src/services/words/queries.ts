import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TWordMasterKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_WORD_MASTER,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TWordMaster) =>
  ({
    TableName: Environment.TABLE_NAME_WORD_MASTER,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

/** データ取得 */
export const getFromIgnore = (key: Tables.TWordIgnoreKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_WORD_IGNORE,
  Key: key,
});
