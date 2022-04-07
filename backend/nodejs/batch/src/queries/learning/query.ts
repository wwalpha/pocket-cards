import { DynamoDB } from 'aws-sdk';
import { Environments } from '@utils';

export const byUserDaily = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, nextTime',
  KeyConditionExpression: '#userId = :userId AND #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':nextTime': nextTime,
    ':userId': userId,
  },
  IndexName: 'gsiIdx1',
});
