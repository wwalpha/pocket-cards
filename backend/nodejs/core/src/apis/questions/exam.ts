import { Request } from 'express';
import { Logger, DateUtils, Commons, QueryUtils, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { LearningService } from '@services';

/** 今日のテスト */
export default async (req: Request<any, any, APIs.QuestionTestRequest, any>): Promise<APIs.QuestionTestResponse> => {
  let userId = Commons.getUserId(req);
  const guardianId = Commons.getGuardian(req);
  const { subject, userId: username } = req.body;

  // 科目選択されていない
  if (!subject) {
    throw new Error('Please select subject.');
  }

  // 保護者からのリクエスト
  if (guardianId === userId) {
    if (!username) {
      throw new ValidationError('Required username.');
    }

    userId = username;
  }

  // next study date
  const date = DateUtils.getNow();

  let results: Tables.TLearning[] = [];

  // 漢字の場合
  if (subject === Consts.SUBJECT.HANDWRITING) {
    // 過去問全て
    results = await LearningService.dailyPastTasks(userId, date, subject);
  } else {
    // 漢字以外の場合
    results = await LearningService.dailyTest(userId, date, subject);
  }

  // 検索結果０件の場合
  if (results.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.length}`);

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
