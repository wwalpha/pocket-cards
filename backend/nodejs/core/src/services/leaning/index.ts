import { DBHelper } from '@utils';
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
  const groupInfo = await describe(item.qid, item.userId);

  // if exists
  if (!groupInfo) {
    throw new Error(`Leaning task not exists. ${item.qid}`);
  }

  await DBHelper().put(Queries.put(item));
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

/** 日次テスト */
export const dailyTest = async (userId: string, nextTime: string, subject: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.test(userId, nextTime, subject));

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

export const dailyPastTasks = async (userId: string, nextTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.past(userId, nextTime));

  return results.Items;
};

export const dailyCurrentTasks = async (userId: string, lastTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.current(userId, lastTime));

  return results.Items;
};

/** 学習任務一覧 */
export const listByGroup = async (groupId: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byGroupId(groupId));

  return results.Items;
};

/** 学習任務一覧 */
export const listByUser = async (userId: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byUserId(userId));

  return results.Items;
};

/** 学習任務一覧 */
export const listByQuestion = async (questionId: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Queries.byQuestionId(questionId));

  return results.Items;
};
