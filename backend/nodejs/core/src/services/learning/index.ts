import { Consts, Environment } from '@consts';
import { DBHelper } from '@utils';
import moment from 'moment';
import { Tables } from 'typings';
import * as Queries from './queries';

/** レポート詳細取得 */
export const describe = async (qid: string, userId: string): Promise<Tables.TLearning | undefined> => {
  const results = await DBHelper().get<Tables.TLearning>(Queries.get({ qid, userId }));

  return results?.Item;
};

/** レポート新規作成 */
export const regist = async (item: Tables.TLearning): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TLearning): Promise<void> => {
  const result = await describe(item.qid, item.userId);

  // if exists
  if (!result) {
    throw new Error(`Leaning task not exists. ${item.qid}`);
  }

  await DBHelper().put(
    Queries.put({
      ...result,
      ...item,
    })
  );
};

/** カリキュラム削除 */
export const remove = async (qid: string, userId: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      qid,
      userId,
    })
  );
};

/** 学習項目一括削除 */
export const truncate = async (learnings: Tables.TLearning[]): Promise<void> => {
  await DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learnings);
};

/** 日次復習 */
export const dailyReview = async (userId: string, subject: string): Promise<Tables.TLearning[]> => {
  // 当日の日付
  const nextTime = moment().format('YYYYMMDD');
  // 演習で間違った問題一覧を取得する
  const results = await DBHelper().query<Tables.TLearning>(Queries.review(userId, nextTime, subject));

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

/** 基準日以前全て未テスト問題一覧 */
export const untested = async (userId: string, nextTime: string, subject?: string) => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.untested(userId, nextTime, subject));

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

/** 全件検索 */
export const listAll = async (): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().scan<Tables.TLearning>({ TableName: Environment.TABLE_NAME_LEARNING });

  return results.Items;
};

/** 学習任務一覧 */
export const listByGroup = async (groupId: string, userId?: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byGroupId(groupId, userId));

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
export const listByQuestion = async (questionId: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byQuestionId(questionId));

  return results.Items;
};

/** 週テスト対策一覧 */
export const listByWeekly = async (userId: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byWeekly(userId, subject));

  return results.Items;
};
