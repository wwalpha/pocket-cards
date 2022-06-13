import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { CurriculumService, LearningService, QuestionService, UserService } from '@services';
import { Logger, DateUtils, Commons, QueryUtils, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { IncomingHttpHeaders } from 'http';

/** 今日の学習 */
export default async (req: Request<any, any, any, APIs.QuestionStudyQuery>): Promise<APIs.QuestionStudyResponse> => {
  // ユーザID
  const userId = Commons.getUserId(req);
  const subject = req.query.subject;

  // 科目選択されていない
  if (!subject) {
    throw new ValidationError('Please select subject.');
  }

  // 直近不正解の問題を優先する
  const learnings = await getDailyPractice(userId, subject);

  // 検索結果０件の場合
  if (learnings.length >= Environment.WORDS_LIMIT) {
    return await getQuestions(learnings);
  }

  // 未学習
  return await getUnlearned(learnings, userId, subject, req.headers);
};

const getDailyPractice = async (userId: string, subject: string) => {
  // next study date
  const date = DateUtils.getNow();

  // 算数以外は処理終了
  if (Consts.SUBJECT.MATHS !== subject) {
    return await LearningService.dailyPractice(userId, date, subject);
  }

  const questions = await LearningService.dailyMaths(userId, date);

  // 問題上限に達した場合
  if (questions.length >= Environment.WORDS_LIMIT) {
    return questions;
  }

  // テスト問題
  const dailyTest = await LearningService.dailyTest(userId, date, subject);

  return [...questions, ...dailyTest];
};

/** 質問詳細を取得する */
const getQuestions = async (dataRows: Tables.TLearning[]): Promise<APIs.QuestionStudyResponse> => {
  Logger.info(`Count: ${dataRows.length}`);
  // 時間順で上位N件を対象とします
  const targets = dataRows.slice(0, Environment.WORDS_LIMIT);

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(targets);

  return {
    count: details.length,
    questions: details,
  };
};

/**
 * 未着手の学習問題一覧
 *
 * @param leanings 進行中の学習
 * @param userId ユーザＩＤ
 * @param subject 科目
 * @param header ヘッダ情報
 * @returns
 */
const getUnlearned = async (
  leanings: Tables.TLearning[],
  userId: string,
  subject: string,
  header: IncomingHttpHeaders
): Promise<APIs.QuestionStudyResponse> => {
  const userInfo = await UserService.getUserInfo(userId, header);

  if (!userInfo.teacher) {
    throw new Error('Teacher not found.');
  }

  // 未学習のカリキュラム一覧を取得する
  let rows = await CurriculumService.getUnlearned(userInfo.teacher, userId, subject);
  // 並べ替え
  rows = orderBy(rows, 'order').filter((item) => item.subject === subject);

  const groupIds = getGroupIds(rows);

  // 未学習の問題がありません
  if (groupIds.length === 0) {
    return await getQuestions(leanings);
  }

  // get unlearned
  const unlearned = await Promise.all(groupIds.map((item) => LearningService.dailyUnlearned(userId, item)));

  const qids = unlearned
    .reduce(
      (prev, curr) => {
        return prev.concat(curr.map((item) => item.qid));
      },
      leanings.map((item) => item.qid)
    )
    .slice(0, Environment.WORDS_LIMIT);

  const results = await Promise.all(qids.map((item) => QuestionService.describe(item)));
  const questions = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  return {
    count: questions.length,
    questions: questions,
  };
};

const getGroupIds = (dataRows: Tables.TCurriculums[]) => {
  let count = 0;
  const groupIds = [];

  while (count < Environment.WORDS_LIMIT && dataRows.length > 0) {
    const item = dataRows.shift();

    if (!item) break;

    // count
    count += item.unlearned;
    // count group id
    groupIds.push(item.groupId);
  }

  return groupIds;
};
