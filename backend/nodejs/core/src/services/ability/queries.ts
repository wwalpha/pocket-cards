import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

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

/**
 * 科目ごと検索
 */
export const byKey = (id: string) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': id,
    },
  } as DynamoDB.DocumentClient.QueryInput);

export const reset = (id: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
  Key: {
    id: id,
  },
  UpdateExpression: 'set times = :times',
  ExpressionAttributeValues: {
    ':times': 0,
  },
});
