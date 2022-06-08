import { Request } from 'express';
import { Commons } from '@utils';
import { Consts } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, LearningService, QuestionService, WordService } from '@services';

/** 今日のテスト */
export default async (
  req: Request<APIs.CurriculumIgnoreParams, any, APIs.CurriculumIgnoreRequest, any>
): Promise<APIs.CurriculumIgnoreResponse> => {
  // ユーザID
  const userId = Commons.getUserId(req);
  const { curriculumId, questionId } = req.params;

  // 学習詳細取得する
  const learning = await LearningService.describe(questionId, userId);

  // validation
  if (!learning) return;

  // 未学習の場合、カウントを引く
  if (learning.lastTime === Consts.INITIAL_DATE) {
    await CurriculumService.updateUnlearned(curriculumId, -1);
  }

  const question = await QuestionService.describe(learning.qid);

  // validation
  if (!question) return;

  // 無視単語登録
  await WordService.registIgnore({
    id: userId,
    word: question.title,
  });
};
