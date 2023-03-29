import { Consts, Environment } from '@consts';
import { DateUtils, DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** レポート詳細取得 */
export const describe = async (qid: string, userId: string): Promise<Tables.TLearning | undefined> => {
  const results = await DBHelper().get<Tables.TLearning>(Queries.get({ qid, userId }));

  return results?.Item;
};

/** レポート新規作成 */
export const regist = async (item: Tables.TLearning): Promise<void> => {
  // 国語／英語の場合、復習はない
  if ((item.subject === Consts.SUBJECT.LANGUAGE || item.subject === Consts.SUBJECT.ENGLISH) && item.times === -1) {
    item.times = 0;
  }

  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TLearning): Promise<void> => {
  const result = await describe(item.qid, item.userId);

  // if exists
  if (!result) {
    throw new Error(`Learning task not exists. ${item.qid}`);
  }

  // 国語の場合、復習はない
  if ((item.subject === Consts.SUBJECT.LANGUAGE || item.subject === Consts.SUBJECT.ENGLISH) && item.times === -1) {
    item.times = 0;
  }

  await DBHelper().put(
    Queries.put({
      ...result,
      ...item,
    })
  );
};

/** 学習レコード削除 */
export const remove = async (qid: string, userId: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      qid,
      userId,
    })
  );
};

/** カラム削除 */
export const removeAttribute = async (key: Tables.TLearningKey, updateExpression: string): Promise<void> => {
  await DBHelper().update(Queries.removeAttributes(key, updateExpression));
};

export const scan = async (): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().scan({
    TableName: Environment.TABLE_NAME_LEARNING,
  });

  return results.Items;
};

/** 学習項目一括削除 */
export const truncate = async (learnings: Tables.TLearning[]): Promise<void> => {
  await DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learnings);
};

/** 日次復習 */
export const dailyReview = async (userId: string, subject: string): Promise<Tables.TLearning[]> => {
  // 演習で間違った問題一覧を取得する
  const results = await DBHelper().query<Tables.TLearning>(Queries.review(userId, subject));

  return results.Items;
};

/** 日次テスト */
export const dailyTest = async (userId: string, nextTime: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.test(userId, nextTime, subject));

  return results.Items;
};

/** 日次テスト */
export const dailyTestByGroup = async (
  groupId: string,
  userId: string,
  nextTime: string,
  subject: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.testByGroup(groupId, userId, nextTime, subject));

  return results.Items;
};

/** 日次テスト */
export const dailyNearTestByGroup = async (
  groupId: string,
  userId: string,
  subject: string,
  projection?: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(
    Queries.testNearByGroup(groupId, userId, subject, projection)
  );

  return results.Items;
};

/** 日次練習 */
export const dailyMaths = async (userId: string, nextTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(
    Queries.practiceWithoutToday(userId, nextTime, Consts.SUBJECT.MATHS)
  );

  return results.Items;
};

/** 日次練習 */
export const dailyPractice = async (userId: string, nextTime: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.practice(userId, nextTime, subject));

  return results.Items;
};

/** 未学習問題一覧 */
export const dailyUnlearned = async (userId: string, groupId: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.unlearned(userId, groupId));

  return results.Items;
};

/** 学習日は今日以前全ての問題 */
export const dailyPastTasks = async (
  userId: string,
  nextTime: string,
  subject?: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.past(userId, nextTime, subject));

  return results.Items;
};

/** 学習日は今日より前の全ての問題 */
export const dailyPastsWithoutToday = async (
  userId: string,
  nextTime: string,
  subject?: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.pastWithoutToday(userId, nextTime, subject));

  return results.Items;
};

export const dailyCurrentTasks = async (userId: string, lastTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.current(userId, lastTime));

  return results.Items;
};

export const dailyPriority = async (userId: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.priority(userId, subject, DateUtils.getNow()));

  return results.Items;
};

/** 全件検索 */
export const listAll = async (): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().scan<Tables.TLearning>({ TableName: Environment.TABLE_NAME_LEARNING });

  return results.Items;
};

/** 学習任務一覧 */
export const listByGroup = async (
  groupId: string,
  userId?: string,
  projection?: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byGroupId(groupId, userId, projection));

  return results.Items;
};

/** グループ別学習進捗一覧 */
export const listByGroupWithProjection = async (
  groupId: string,
  projections: string,
  userId?: string
): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(
    Queries.byGroupIdWithProjections(groupId, projections, userId)
  );

  return results.Items;
};

/** 学習任務一覧 */
export const listByUser = async (userId: string, groupId?: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byUserId(userId, groupId));

  return results.Items;
};

/** 学習任務一覧 */
export const listByQuestion = async (questionId: string, projection?: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byQuestionId(questionId, projection));

  return results.Items;
};

/** 週テスト対策一覧 */
export const listByWeekly = async (userId: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byWeekly(userId, subject));

  return results.Items;
};

/** テスト対象問題一覧 */
export const listTests = async (userId: string, subject: string, lastTime?: string) => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.listTests(userId, subject, lastTime));

  return results.Items;
};
