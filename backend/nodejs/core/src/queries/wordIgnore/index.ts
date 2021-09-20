import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.WordIgnoreKey) =>
  ({
    TableName: Environment.TABLE_NAME_WORD_IGNORE,
    Key: key,
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: Tables.TWordIgnore) =>
  ({
    TableName: Environment.TABLE_NAME_WORD_IGNORE,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
