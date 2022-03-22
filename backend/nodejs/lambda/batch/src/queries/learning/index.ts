import { DynamoDB } from 'aws-sdk';
import { Environment } from '@utils';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TLearningKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TLearning): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TLearningKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Key: key,
});

export { query };
