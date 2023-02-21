import { Request } from 'express';
import { Logger, Commons, QueryUtils, ValidationError } from '@utils';
import { APIs } from 'typings';
import { LearningService } from '@services';

/** 自己試験問題取得 */
export default async (req: Request<any, any, APIs.DailyReviewRequest, any>): Promise<APIs.DailyReviewResponse> => {
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

  // 復習一覧問題を取得する
  const results = await LearningService.dailyReview(userId, subject);

  // 検索結果０件の場合
  if (results.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.length}`);

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(results);

  return {
    count: details.length,
    questions: details,
  };
};

const EmptyResponse = (): APIs.DailyExamResponse => ({
  count: 0,
  questions: [],
});
