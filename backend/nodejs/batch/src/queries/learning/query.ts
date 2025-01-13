import { QueryInput } from '@alphax/dynamodb';
import { Consts, Environments } from '@utils';

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

export const byUserNeedTest = (userId: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  KeyConditionExpression: '#userId = :userId AND #nextTime > :nextTime',
  FilterExpression: 'attribute_exists(#subject_status)',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#subject_status': 'subject_status',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': Consts.INITIAL_DATE,
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
