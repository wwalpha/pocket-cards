import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Table } from 'typings';
import * as query from './query';

/** データ登録 */
export const put = (item: Table.THistories) =>
  ({
    TableName: Environment.TABLE_HISTORIES,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

export { query };
