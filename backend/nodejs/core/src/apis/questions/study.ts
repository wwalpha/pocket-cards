import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { CurriculumService, LearningService, QuestionService, UserService } from '@services';
import { Logger, DateUtils, Commons, QueryUtils, ValidationError } from '@utils';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { IncomingHttpHeaders } from 'http';

/** 今日のテスト */
export default async (req: Request<any, any, any, APIs.QuestionStudyQuery>): Promise<APIs.QuestionStudyResponse> => {
  // ユーザID
  const userId = Commons.getUserId(req);
  const subject = req.query.subject;

  // 科目選択されていない
  if (!subject) {
    throw new ValidationError('Please select subject.');
  }

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const results = await LearningService.dailyPractice(userId, date, subject);

  // 検索結果０件の場合
  if (results.length > 0) {
    return await getQuestions(results);
  }

  // 未学習
  return getUnlearned(userId, subject, req.headers);
};

const EmptyResponse = (): APIs.QuestionStudyResponse => ({
  count: 0,
  questions: [],
});

const getQuestions = async (dataRows: Tables.TLearning[]): Promise<APIs.QuestionStudyResponse> => {
  Logger.info(`Count: ${dataRows.length}`);
  // 時間順
  const sorted = orderBy(dataRows, 'nextTime', 'desc');
  // 時間順で上位N件を対象とします
  const targets = dataRows.length > Environment.WORDS_LIMIT ? sorted.slice(0, Environment.WORDS_LIMIT) : dataRows;

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(targets);

  return {
    count: details.length,
    questions: details,
  };
};

const getUnlearned = async (
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

  // no questions
  if (groupIds.length === 0) {
    return EmptyResponse();
  }

  // get unlearned
  const unlearned = await Promise.all(groupIds.map((item) => LearningService.dailyUnlearned(item)));

  const qid = unlearned
    .reduce((prev, curr) => {
      return prev.concat(curr.map((item) => item.qid));
    }, [] as string[])
    .slice(0, Environment.WORDS_LIMIT);

  const results = await Promise.all(qid.map((item) => QuestionService.describe(item)));
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
