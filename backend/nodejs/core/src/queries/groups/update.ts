import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

export const addCount = (key: Tables.TGroupsKey, count: number): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count + :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});

export const minusCount = (key: Tables.TGroupsKey, count: number): DynamoDB.DocumentClient.Update => ({
  TableName: Environment.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count - :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
