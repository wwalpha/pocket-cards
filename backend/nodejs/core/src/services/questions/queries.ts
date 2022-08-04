import { Environment } from '@consts';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TQuestionsKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TQuestions): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TQuestionsKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_QUESTIONS,
  Key: {
    id: key.id,
  } as Tables.TQuestionsKey,
});

export const byGroupId = (groupId: string, projects: string[]): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
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

  if (projects.length > 0) {
    query.ProjectionExpression = projects.join(',');
  }

  return query;
};
