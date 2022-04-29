import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';
export * as query from './query';

/** データ取得 */
export const get = (key: Tables.TWeeklyAbilityKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TWeeklyAbility) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

/** データ削除 */
export const del = (key: Tables.TWeeklyAbilityKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
  Key: key,
});
