import { QueryInput } from '@alphax/dynamodb';
import { Environments } from '@utils';

/**
 * グループIDより、ユーザIDを検索する
 */
export const byUserId = (userId: string, timestamp: string) =>
  ({
    TableName: Environments.TABLE_NAME_TRACES,
    ProjectionExpression: 'qid, #timestamp, subject, timesAfter',
    KeyConditionExpression: '#userId = :userId and #timestamp <= :timestamp',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':timestamp': timestamp,
    },
    IndexName: 'gsiIdx1',
  } as QueryInput);
