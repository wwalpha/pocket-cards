import { Request } from 'express';
import { Commons, ValidationError } from '@utils';
import { APIs } from 'typings';
import { Environment } from '@consts';
import { LearningService, QuestionService } from '@services';

/** 週テスト対策問題一括取得 */
export default async (
  req: Request<any, any, APIs.WeeklyListRequest, APIs.WeeklyListQuery>
): Promise<APIs.WeeklyListResponse> => {
  const { subject } = req.query;
  const userId = Commons.getUserId(req);

  // validation
  if (!subject) {
    throw new ValidationError('Required subject.');
  }

  // results
  const learnings = await LearningService.listByWeekly(userId, subject);

  // 時間順で上位N件を対象とします
  const tasks = learnings.slice(0, Environment.WORDS_LIMIT).map((item) => QuestionService.describe(item.qid));

  // 問題一括取得
  const questions = await Promise.all(tasks);

  return {
    count: questions.length,
    questions: questions.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  };
};
