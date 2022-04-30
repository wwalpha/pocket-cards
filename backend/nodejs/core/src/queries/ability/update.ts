import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';

export const reset = (id: string): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_WEEKLY_ABILITY,
  Key: {
    id: id,
  },
  UpdateExpression: 'set times = :times',
  ExpressionAttributeValues: {
    ':times': 0,
  },
});
