import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 科目ごと検索
 */
export const bySubject = (userId: string, subject: string) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_TEST,
    ProjectionExpression: 'subjectQid, times',
    KeyConditionExpression: '#userId = :userId and begins_with(#subjectQid, :subject)',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#subject': 'subject',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':subject': subject,
    },
  } as DynamoDB.DocumentClient.QueryInput);
