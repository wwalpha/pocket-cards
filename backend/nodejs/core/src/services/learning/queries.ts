import { Consts, Environment } from '@consts';
import { DateUtils } from '@utils';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TLearningKey): DynamoDB.DocumentClient.GetItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TLearning): DynamoDB.DocumentClient.PutItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TLearningKey): DynamoDB.DocumentClient.DeleteItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Key: key,
});

/** データ削除 */
export const removeAttributes = (
  key: Tables.TLearningKey,
  updateExpression: string
): DynamoDB.DocumentClient.UpdateItemInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  Key: key,
  UpdateExpression: updateExpression,
});

/**
 * 再学習済みの問題一覧を取得する
 * 対象: Times = 0, NextTime = Now + 1, LastTime = Now
 */
export const review = (userId: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #nextTime = :nextTime',
  FilterExpression: '#times = :times and #subject = :subject and #lastTime = :lastTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#lastTime': 'lastTime',
    '#times': 'times',
    '#subject': 'subject',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': DateUtils.addDays(1),
    ':lastTime': DateUtils.getNow(),
    ':times': 0,
    ':subject': subject,
  },
  IndexName: 'gsiIdx1',
});

/**
 * 復習単語対象一覧を取得する（科目別）
 *
 * 当日を含めて、過去少なくとも１回学習した事がある、且つ最後の１回は間違った
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC, Top 10
 */
export const practiceWithoutToday = (
  userId: string,
  nextTime: string,
  subject: string
): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId AND #nextTime <= :nextTime',
  FilterExpression: '#times = :times AND #subject = :subject AND #lastTime <> :lastTime1 AND #lastTime <> :lastTime2',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
    '#subject': 'subject',
    '#lastTime': 'lastTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': 0,
    ':nextTime': nextTime,
    ':subject': subject,
    ':lastTime1': nextTime,
    ':lastTime2': Consts.INITIAL_DATE,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
});

/**
 * 問題一覧を取得する
 * 対象: Times <> 0, NextTime <= now, NextTime DESC, Top 10
 */
export const test = (userId: string, nextTime: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times > :times and #subject = :subject',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
    '#subject': 'subject',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':nextTime': nextTime,
    ':times': 0,
    ':subject': subject,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
});

/**
 * グループのテスト問題一覧を取得する
 *
 * 対象: GroupId = :groupId, NextTime <= now, Subject = :subject, times <> 0
 */
export const testByGroup = (
  groupId: string,
  userId: string,
  nextTime: string,
  subject: string
): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#groupId = :groupId and #nextTime <= :nextTime',
  FilterExpression: '#userId = :userId and #subject = :subject and #times > :times',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#nextTime': 'nextTime',
    '#userId': 'userId',
    '#subject': 'subject',
    '#times': 'times',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
    ':nextTime': nextTime,
    ':userId': userId,
    ':subject': subject,
    ':times': 0,
  },
  IndexName: 'gsiIdx2',
  ScanIndexForward: false,
});

/**
 * 復習単語対象一覧を取得する（科目別）
 *
 * 当日を含めて、過去少なくとも１回学習した事がある、且つ最後の１回は間違った
 *
 * 対象：Times = 0, NextTime <= now, NextTime DESC, Top 10
 */
export const practice = (userId: string, nextTime: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId and #nextTime <= :nextTime',
  FilterExpression: '#times = :times and #subject = :subject and #lastTime <> :lastTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#nextTime': 'nextTime',
    '#times': 'times',
    '#subject': 'subject',
    '#lastTime': 'lastTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':times': 0,
    ':nextTime': nextTime,
    ':subject': subject,
    ':lastTime': Consts.INITIAL_DATE,
  },
  IndexName: 'gsiIdx1',
  ScanIndexForward: false,
});

/** Daily Questions */
export const pastWithoutToday = (
  userId: string,
  nextTime: string,
  subject?: string
): DynamoDB.DocumentClient.QueryInput => {
  return past(userId, nextTime, subject, '#userId = :userId and #nextTime < :nextTime');
};

export const past = (
  userId: string,
  nextTime: string,
  subject?: string,
  expression: string = '#userId = :userId and #nextTime <= :nextTime'
): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    ProjectionExpression: 'qid, groupId, subject, times',
    KeyConditionExpression: expression,
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#nextTime': 'nextTime',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':nextTime': nextTime,
    },
    IndexName: 'gsiIdx1',
    ScanIndexForward: false,
  };

  // if exists
  if (subject) {
    query.FilterExpression = '#subject = :subject';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#subject': 'subject',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':subject': subject,
    };
  }

  return query;
};

// テスト対象問題一覧
export const listTests = (userId: string, subject: string, lastTime?: string): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    ProjectionExpression: 'qid',
    KeyConditionExpression: '#userId = :userId and #subject_status = :subject_status',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#subject_status': 'subject_status',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':subject_status': `${subject}_TEST`,
    },
    IndexName: 'gsiIdx4',
  };

  // if exists
  if (lastTime) {
    query.FilterExpression = '#lastTime = :lastTime';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#lastTime': 'lastTime',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':lastTime': lastTime,
    };
  }

  return query;
};

export const current = (userId: string, lastTime: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, subject, times',
  KeyConditionExpression: '#userId = :userId',
  FilterExpression: '#lastTime = :lastTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#lastTime': 'lastTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':lastTime': lastTime,
  },
  IndexName: 'gsiIdx1',
});

export const byGroupId = (groupId: string, userId?: string): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    ProjectionExpression: 'qid, userId',
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx2',
  };

  // if exists
  if (userId) {
    query.FilterExpression = '#userId = :userId';
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

export const byGroupIdWithProjections = (
  groupId: string,
  projections: string,
  userId?: string
): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    ProjectionExpression: projections,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: {
      '#groupId': 'groupId',
    },
    ExpressionAttributeValues: {
      ':groupId': groupId,
    },
    IndexName: 'gsiIdx2',
  };

  // if exists
  if (userId) {
    query.FilterExpression = '#userId = :userId';
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

export const byQuestionId = (questionId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, userId',
  KeyConditionExpression: '#qid = :qid',
  ExpressionAttributeNames: {
    '#qid': 'qid',
  },
  ExpressionAttributeValues: {
    ':qid': questionId,
  },
});

export const byUserId = (userId: string, groupId?: string): DynamoDB.DocumentClient.QueryInput => {
  const query: DynamoDB.DocumentClient.QueryInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    ProjectionExpression: 'qid, userId, groupId, subject, times, lastTime',
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    IndexName: 'gsiIdx1',
  };

  // if exists
  if (groupId) {
    query.FilterExpression = '#groupId = :groupId';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#groupId': 'groupId',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':groupId': groupId,
    };
  }

  return query;
};

export const unlearned = (userId: string, groupId: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid,lastTime,times',
  KeyConditionExpression: '#groupId = :groupId',
  FilterExpression: '#lastTime = :lastTime AND #userId = :userId',
  ExpressionAttributeNames: {
    '#groupId': 'groupId',
    '#lastTime': 'lastTime',
    '#userId': 'userId',
  },
  ExpressionAttributeValues: {
    ':groupId': groupId,
    ':lastTime': Consts.INITIAL_DATE,
    ':userId': userId,
  },
  IndexName: 'gsiIdx2',
});

export const byWeekly = (userId: string, subject: string): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid',
  KeyConditionExpression: '#userId = :userId AND begins_with(#subject, :subject)',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#subject': 'subject_weekly',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':subject': subject,
  },
  IndexName: 'gsiIdx3',
});

export const priority = (userId: string, subject: string, nextTime: String): DynamoDB.DocumentClient.QueryInput => ({
  TableName: Environment.TABLE_NAME_LEARNING,
  ProjectionExpression: 'qid, groupId',
  KeyConditionExpression: '#userId = :userId AND begins_with(#subject_status, :subject_status)',
  FilterExpression: '#priority = :priority AND #nextTime <= :nextTime',
  ExpressionAttributeNames: {
    '#userId': 'userId',
    '#subject_status': 'subject_status',
    '#priority': 'priority',
    '#nextTime': 'nextTime',
  },
  ExpressionAttributeValues: {
    ':userId': userId,
    ':subject_status': subject,
    ':priority': '1',
    ':nextTime': nextTime,
  },
  IndexName: 'gsiIdx4',
});
