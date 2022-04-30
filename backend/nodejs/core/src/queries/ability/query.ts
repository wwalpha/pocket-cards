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
    FilterExpression: '#times >= :times',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#times': 'times',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':times': 0,
    },
  } as DynamoDB.DocumentClient.QueryInput);
