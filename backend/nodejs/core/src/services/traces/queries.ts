import { GetItemInput, PutItemInput, QueryInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TTracesKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_TRACES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TTraces): PutItemInput<Tables.TTraces> => ({
  TableName: Environment.TABLE_NAME_TRACES,
  Item: item,
});

export const byQuestionId = (questionId: string): QueryInput => ({
  TableName: Environment.TABLE_NAME_TRACES,
  KeyConditionExpression: '#qid = :qid',
  ExpressionAttributeNames: {
    '#qid': 'qid',
  },
  ExpressionAttributeValues: {
    ':qid': questionId,
  },
});

export const listDailyStatus = (userId: string, date: string): QueryInput => ({
  TableName: Environment.TABLE_NAME_TRACES,
  ProjectionExpression: 'qid, lastTime, subject, timesBefore, timesAfter',
  KeyConditionExpression: '#userId = :userId AND begins_with(#timestamp, :date)',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#timestamp': 'timestamp',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':date': date,
  },
  IndexName: 'gsiIdx1',
});
