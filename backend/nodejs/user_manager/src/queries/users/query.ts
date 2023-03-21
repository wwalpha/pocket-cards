import { QueryInput } from '@alphax/dynamodb';
import { Environments } from '../../consts';

export const byTeacher = (userId: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_USERS,
  KeyConditionExpression: '#teacher = :teacher',
  ExpressionAttributeNames: {
    '#teacher': 'teacher',
  },
  ExpressionAttributeValues: {
    ':teacher': userId,
  },
  IndexName: 'gsiIdx1',
});
