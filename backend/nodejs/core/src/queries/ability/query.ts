import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 科目ごと検索
 */
export const byKey = (id: string) =>
  ({
    TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
    ProjectionExpression: 'qid, times',
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': id,
    },
  } as DynamoDB.DocumentClient.QueryInput);
