import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now, NextTime DESC, Top 10
 */
export const test = (userId: string, subjectNextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #subjectNextTime <= :subjectNextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#subjectNextTime': 'subjectNextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':subjectNextTime': subjectNextTime,
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
export const study = (userId: string, subjectNextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #subjectNextTime <= :subjectNextTime',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#times': 'times',
    '#subjectNextTime': 'subjectNextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': 0,
    ':subjectNextTime': subjectNextTime,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
  Limit: 10,
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
