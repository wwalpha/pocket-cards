import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
import * as query from './query';

/** データ登録 */
export const put = (item: Tables.THistories) =>
  ({
    TableName: Environment.TABLE_HISTORIES,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { query };
