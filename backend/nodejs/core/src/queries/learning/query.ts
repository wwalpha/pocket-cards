import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now, NextTime DESC, Top 10
 */
export const test = (userId: string, nextTime: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
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
  Limit: 1000,
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
export const past = (userId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
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

export const current = (userId: string, lastTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, times',
  KeyConditionExpression: '#userId = :userId',
  FilterExpression: '#lastTime = :lastTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#lastTime': 'lastTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':lastTime': lastTime,
  },
  IndexName: 'gsiIdx1',
});

export const byGroupId = (groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, userId',
  KeyConditionExpression: '#groupId = :groupId',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
  },
  IndexName: 'gsiIdx2',
});

export const byQuestionId = (questionId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#qid = :qid',
  ExpressionAttributeNames: {
    '#qid': 'qid',
  },
  ExpressionAttributeValues: {
    ':qid': questionId,
  },
});

export const byUserId = (userId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, times, lastTime',
  KeyConditionExpression: '#userId = :userId',
  ExpressionAttributeNames: {
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
  },
  IndexName: 'gsiIdx1',
});
