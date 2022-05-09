import { Request } from 'express';
import { DBHelper, Logger, DateUtils, Commons, QueryUtils } from '@utils';
import { Learning } from '@queries';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (req: Request<any, any, any, APIs.QuestionStudyQuery>): Promise<APIs.QuestionTestResponse> => {
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
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.test(userId, date, subject));

  // 検索結果０件の場合
  if (results.Items.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.Items.length}`);

  const items = results.Items;
  // // 時間順
  // const sorted = orderBy(items, 'lastTime');
  // // 時間順で上位N件を対象とします
  const targets = items.length > Environment.WORDS_LIMIT ? items.slice(0, Environment.WORDS_LIMIT) : items;

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(targets);

  return {
    count: details.length,
    questions: details,
  };
};

const EmptyResponse = (): APIs.QuestionStudyResponse => ({
  count: 0,
  questions: [],
});
