import { DynamoDB } from 'aws-sdk';
import { Environments } from '@consts';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TCurriculumsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TCurriculums): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TCurriculumsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_CURRICULUMS,
  Key: key,
});

export { query };
