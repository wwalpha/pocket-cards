import { GetItemInput, PutItemInput, DeleteItemInput, QueryInput, UpdateInput } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TCurriculumsKey): GetItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TCurriculums): PutItemInput<Tables.TCurriculums> => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TCurriculumsKey): DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
});

/** カリキュラム一覧を取得する */
export const byGuardian = (guardian: string, subject?: string, userId?: string): QueryInput => {
  const query: QueryInput = {
    TableName: Environment.TABLE_NAME_CURRICULUMS,
    KeyConditionExpression: '#guardian = :guardian',
    ExpressionAttributeNames: {
      '#guardian': 'guardian',
    },
    ExpressionAttributeValues: {
      ':guardian': guardian,
    },
    IndexName: 'gsiIdx1',
  };

  const filter: string[] = [];

  // if subject exists
  if (subject) {
    // filter expression item
    filter.push('#subject = :subject');
    // expression attribute names
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#subject': 'subject',
    };
    // expression attribute values
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':subject': subject,
    };
  }

  // if user id exists
  if (userId) {
    // filter expression item
    filter.push('#userId = :userId');
    // expression attribute names
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#userId': 'userId',
    };
    // expression attribute values
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':userId': userId,
    };
  }

  if (filter.length > 0) {
    query.FilterExpression = filter.join(' AND ');
  }

  return query;
};

/** カリキュラム一覧を取得する */
export const byGroupId = (groupId: string, userId?: string): QueryInput => {
  const query: QueryInput = {
    TableName: Environment.TABLE_NAME_CURRICULUMS,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx2',
  };

  // range key
  if (userId) {
    query.KeyConditionExpression = '#groupId = :groupId AND #userId = :userId';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#userId': 'userId',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':userId': userId,
    };
  }

  return query;
};

/** カリキュラム一覧を取得する（未学習のみ） */
export const byUnlearned = (guardian: string, userId: string, subject: string): QueryInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  KeyConditionExpression: '#guardian = :guardian',
  FilterExpression: '#userId = :userId and #unlearned <> :unlearned and #subject = :subject',
  ExpressionAttributeNames: {
    '#guardian': 'guardian',
    '#userId': 'userId',
    '#subject': 'subject',
    '#unlearned': 'unlearned',
  },
  ExpressionAttributeValues: {
    ':guardian': guardian,
    ':userId': userId,
    ':subject': subject,
    ':unlearned': 0,
  },
  IndexName: 'gsiIdx1',
});

/** カリキュラム一覧を取得する（未学習のみ） */
export const updateUnlearned = (key: Tables.TCurriculumsKey, count: number): UpdateInput => ({
  TableName: Environment.TABLE_NAME_CURRICULUMS,
  Key: key,
  UpdateExpression: 'set #unlearned = #unlearned + :nums',
  ExpressionAttributeNames: {
    '#unlearned': 'unlearned',
  },
  ExpressionAttributeValues: {
    ':nums': count,
  },
});
