import { Consts, Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TReports): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_REPORTS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TReports) =>
  ({
    TableName: Environment.TABLE_NAME_REPORTS,
    Item: item,
  } as DynamoDB.DocumentClient.PutItemInput);

/**
 * グループIDより、ユーザIDを検索する
 */
export const byDailyProgress = (userId: string) =>
  ({
    TableName: Environment.TABLE_NAME_REPORTS,
    KeyConditionExpression: '#userId = :userId and begins_with(typeDate, :typeDate)',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':typeDate': Consts.REPORT_TYPE.DAILY_PROGRESS,
    },
  } as DynamoDB.DocumentClient.QueryInput);
