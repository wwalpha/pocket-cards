import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { API, Table } from 'typings';

/** データ取得 */
export const get = (id: string) =>
  ({
    TableName: Environment.TABLE_WORD_MASTER,
    Key: {
      id,
    },
  } as DynamoDB.DocumentClient.GetItemInput);

/** データ登録 */
export const put = (item: Table.TWordMaster) =>
  ({
    TableName: Environment.TABLE_WORD_MASTER,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);
