import { DynamoDB } from 'aws-sdk';
import { Environments } from '@utils';

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now, NextTime DESC, Top 10
 */
export const test = (userId: string, nextTime: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environments.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times and #subject = :subject',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
    '#subject': 'subject',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
    ':times': 0,
    ':subject': subject,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
  Limit: 50,
});

/**
 * 新規学習単語対象一覧を取得する
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC, Top 10
 */
export const study = (userId: string, nextTime: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times = :times and #subject = :subject',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#times': 'times',
    '#nextTime': 'nextTime',
    '#subject': 'subject',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': 0,
    ':nextTime': nextTime,
    ':subject': subject,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
  Limit: 50,
});

/** Daily Questions */
export const daily = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, times',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
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
