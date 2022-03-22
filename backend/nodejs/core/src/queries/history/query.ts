import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * グループIDより、ユーザIDを検索する
 */
export const byUserId = (userId: string, timestamp: string) =>
  ({
    TableName: Environment.TABLE_NAME_HISTORIES,
    ProjectionExpression: 'qid, #timestamp, subject, timesAfter',
    KeyConditionExpression: '#userId = :userId and #timestamp >= :timestamp',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':timestamp': timestamp,
    },
  } as DynamoDB.DocumentClient.QueryInput);
