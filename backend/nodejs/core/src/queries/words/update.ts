import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** 次の学習時間を調整する */
export const nextTime = (word: string, groupId: string, nextTime: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_WORDS,
  Key: {
    id: word,
    groupId,
  },
  UpdateExpression: 'set #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':nextTime': nextTime,
  },
});

/** 単語情報を更新する */
export const info = (item: Tables.TWords): DynamoDB.DocumentClient.Update => ({
  TableName: Environment.TABLE_NAME_WORDS,
  Key: {
    id: item.id,
    groupId: item.groupId,
  },
  UpdateExpression: 'set #times = :times, #lastTime = :lastTime, #nextTime = :nextTime',
  ExpressionAttributeNames: {
    '#times': 'times',
    '#lastTime': 'lastTime',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':times': item.times,
    ':lastTime': item.lastTime,
    ':nextTime': item.nextTime,
  },
});
