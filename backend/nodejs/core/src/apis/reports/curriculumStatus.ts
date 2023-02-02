import { Request } from 'express';
import { APIs, Tables } from 'typings';
import { CurriculumService, LearningService, QuestionService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<void, any, APIs.CurriculumStatusRequest, any>
): Promise<APIs.CurriculumStatusResponse> => {
  const { curriculums, startDate, endDate } = req.body;

  // validation
  if (!curriculums || curriculums.length === 0) {
    throw new ValidationError('Curriculum was not found.');
  }

  // validation
  if (!startDate || !endDate) {
    throw new ValidationError('Date not specific.');
  }

  const tasks = curriculums.map<Promise<Tables.TLearning[]>>(async (curriculumId) => {
    const cInfo = await CurriculumService.describe(curriculumId);

    // curriculum not found
    if (!cInfo) return [];

    // 問題一覧、開始終了期間内
    const learnings = (
      await LearningService.listByGroupWithProjection(cInfo.groupId, 'qid, times, nextTime, lastTime', cInfo.userId)
    ).filter((item) => startDate <= item.nextTime && item.nextTime >= endDate);

    // 対象問題存在しない
    if (learnings.length === 0) return [];

    // 問題の詳細情報を検索する
    const questions = await Promise.all(learnings.map((item) => QuestionService.describe(item.qid)));

    return learnings.map((item) => {
      const question = questions.find((q) => q?.id === item.qid);

      return {
        ...item,
        question: question?.title,
      };
    });
  });

  // カリキュラム一括実行
  const results = await Promise.all(tasks);
  const items = results.reduce((prev, curr) => {
    return curr.concat(prev);
  }, []);

  return {
    count: items.length,
    items: items,
  };
};
