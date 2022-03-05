import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now
 */
export const test = (setId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  ProjectionExpression: 'id, lastTime',
  KeyConditionExpression: '#setId = :setId and #nextTime <= :nextTime',
  FilterExpression: '#times <> :times',
  ExpressionAttributeNames: {
    '#setId': 'setId',
    '#nextTime': 'nextTime',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':setId': setId,
    ':nextTime': nextTime,
    ':times': 0,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
});

/**
 * 新規学習単語対象一覧を取得する
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC
 */
export const study = (setId: string, nextTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  ProjectionExpression: 'id, lastTime',
  KeyConditionExpression: '#setId = :setId and #nextTime <= :nextTime',
  FilterExpression: '#times = :times',
  ExpressionAttributeNames: {
    '#setId': 'setId',
    '#times': 'times',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':setId': setId,
    ':times': 0,
    ':nextTime': nextTime,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
});
