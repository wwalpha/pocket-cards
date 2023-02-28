import { UpdateInput } from '@alphax/dynamodb';
import { Environments } from '../../consts';

/** ユーザ情報を更新する */
export const userInfo = (id: string, studyQuery: string) =>
  ({
    TableName: Environments.TABLE_NAME_USERS,
    Key: {
      id,
    },
    UpdateExpression: 'set #studyQuery = :studyQuery',
    ExpressionAttributeNames: {
      '#studyQuery': 'studyQuery',
    },
    ExpressionAttributeValues: {
      ':studyQuery': studyQuery,
    },
  } as UpdateInput);
