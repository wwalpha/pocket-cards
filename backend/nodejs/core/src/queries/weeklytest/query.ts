import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 科目ごと検索
 */
export const bySubject = (userId: string, subject: string) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_TEST,
    ProjectionExpression: '#subjectQid, times',
    KeyConditionExpression: '#userId = :userId and begins_with(#subjectQid, :subjectQid)',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#subjectQid': 'subjectQid',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':subjectQid': subject,
    },
  } as DynamoDB.DocumentClient.QueryInput);
