import { QueryInput } from '@alphax/dynamodb';
import { Environments } from '@utils';

export const byUserDaily = (userId: string, nextTime: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
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

export const byUserDailyTested = (userId: string, nextTime: string, lastTime: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  KeyConditionExpression: '#userId = :userId AND #nextTime >= :nextTime',
  FilterExpression: '#lastTime = :lastTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#lastTime': 'lastTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
    ':lastTime': lastTime,
  },
  IndexName: 'gsiIdx1',
});

export const byUserTests = (userId: string, nextTime: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject',
  KeyConditionExpression: '#userId = :userId AND #nextTime = :nextTime',
  FilterExpression: '#times > :times',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':nextTime': nextTime,
    ':userId': userId,
    ':times': 0,
  },
  IndexName: 'gsiIdx1',
});

export const byUserId = (userId: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, times',
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  IndexName: 'gsiIdx1',
});
