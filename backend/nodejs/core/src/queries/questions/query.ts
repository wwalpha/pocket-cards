import { DynamoDB } from 'aws-sdk';
import { Environment } from '@consts';

export const byGroupId = (setId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  KeyConditionExpression: '#setId = :setId',
  ExpressionAttributeNames: {
    '#setId': 'setId',
  },
  ExpressionAttributeValues: {
    ':setId': setId,
  },
  IndexName: 'gsiIdx1',
});
