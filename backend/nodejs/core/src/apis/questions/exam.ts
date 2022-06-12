import { Request } from 'express';
import { Logger, DateUtils, Commons, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { LearningService } from '@services';

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
  const results = await LearningService.dailyTest(userId, date, subject);

  // 検索結果０件の場合
  if (results.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.length}`);

  // 時間順
  // const sorted = orderBy(items, 'lastTime');
  // 時間順で上位N件を対象とします
  const targets = results.slice(0, Environment.WORDS_LIMIT);

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
