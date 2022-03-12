import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as query from './query';

/** データ取得 */
export const get = (key: Tables.TQuestionsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TQuestions): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TQuestionsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: {
    id: key.id,
  } as Tables.TQuestionsKey,
});

export { query };
