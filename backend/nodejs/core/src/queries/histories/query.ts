import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * グループIDより、ユーザIDを検索する
 */
export const byUserId = (userId: string) =>
  ({
    TableName: Environment.TABLE_NAME_HISTORIES,
    ProjectionExpression: '#userId, #timestamp, japanese, science, society',
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  } as DynamoDB.DocumentClient.QueryInput);
