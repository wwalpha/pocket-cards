import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

/** データ登録 */
export const put = (item: Tables.TTraces): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_TRACES,
  Item: item,
});
