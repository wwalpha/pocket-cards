import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now, NextTime DESC, Top 10
 */
export const test = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'id',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
    ':times': 0,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
  Limit: 100,
});

/**
 * 新規学習単語対象一覧を取得する
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC, Top 10
 */
export const study = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'id',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#times': 'times',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': 0,
    ':nextTime': nextTime,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
  Limit: 100,
});

// export const byGroupId = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
//   TableName: Environment.TABLE_NAME_QUESTIONS,
//   KeyConditionExpression: '#groupId = :groupId',
//   ExpressionAttributeNames: {
//     '#groupId': 'groupId',
//   },
//   ExpressionAttributeValues: {
//     ':groupId': groupId,
//   },
//   IndexName: 'gsiIdx1',
// });
