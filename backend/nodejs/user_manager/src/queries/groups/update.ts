import { Environments } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

export const addCount = (key: Tables.TGroupsKey, count: number): UpdateItemInput => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count + :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});

export const minusCount = (key: Tables.TGroupsKey, count: number): Update => ({
  TableName: Environments.TABLE_NAME_GROUPS,
  Key: key,
  UpdateExpression: 'set #count = #count - :nums',
  ExpressionAttributeNames: {
    '#count': 'count',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
