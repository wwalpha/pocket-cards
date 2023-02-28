import { QueryInput } from '@alphax/dynamodb';
import { Environments } from '@utils';

/**
 * 教師一覧取得
 */
export const getTeachers = (userId: string, timestamp: string) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    ProjectionExpression: 'id',
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
