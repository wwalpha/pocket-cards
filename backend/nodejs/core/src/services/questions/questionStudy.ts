import { Request } from 'express';
import { DBHelper, Logger, DateUtils, Commons, QueryUtils } from '@utils';
import { Learning } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (req: Request<any, any, any, APIs.QuestionStudyQuery>): Promise<APIs.QuestionStudyResponse> => {
  // ユーザID
  const userId = Commons.getUserId(req);
  const subject = req.query.subject;

  // 科目選択されていない
  if (!subject) {
    throw new Error('Please select subject.');
  }

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.study(userId, date, subject));

  // 検索結果０件の場合
  if (results.Count === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.Count}`);

  // const items = results.Items;
  // // 時間順
  // const sorted = orderBy(items, 'lastTime');
  // // 時間順で上位N件を対象とします
  // const targets = sorted.length > Environment.WORDS_LIMIT ? sorted.slice(0, Environment.WORDS_LIMIT) : sorted;

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(results.Items);

  return {
    count: details.length,
    questions: details,
  };
};

const EmptyResponse = (): APIs.QuestionStudyResponse => ({
  count: 0,
  questions: [],
});
