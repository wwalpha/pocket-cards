import { UpdateInput } from '@alphax/dynamodb';
import { Environments } from '@consts';
import { Tables } from 'typings';

export const addCount = (key: Tables.TGroupsKey, count: number): UpdateInput => ({
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

export const minusCount = (key: Tables.TGroupsKey, count: number): UpdateInput => ({
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
