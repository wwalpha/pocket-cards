import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TQuestionsKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TQuestions): PutItemInput<Tables.TQuestions> => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TQuestionsKey): DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: {
    id: key.id,
  } as Tables.TQuestionsKey,
});

export const byGroupId = (groupId: string, projections: string[]): QueryInput => {
  const query: QueryInput = {
    TableName: Environment.TABLE_NAME_QUESTIONS,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx1',
  };

  if (projections.length > 0) {
    query.ProjectionExpression = projections.join(',');
  }

  return query;
};
