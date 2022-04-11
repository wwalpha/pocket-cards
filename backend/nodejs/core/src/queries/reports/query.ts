import { DynamoDB } from 'aws-sdk';
import { Consts, Environment } from '@consts';

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
