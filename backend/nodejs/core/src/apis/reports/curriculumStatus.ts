import { Request } from 'express';
import { APIs } from 'typings';
import { CurriculumService, LearningService, QuestionService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.CurriculumStatusParams, any, APIs.CurriculumStatusRequest, any>
): Promise<APIs.CurriculumStatusResponse> => {
  const { curriculumId } = req.params;

  const curriculum = await CurriculumService.describe(curriculumId);

  if (!curriculum) {
    throw new ValidationError('Curriculum was not found.');
  }

  // 問題一覧
  const learnings = await LearningService.listByGroupWithProjection(
    curriculum.groupId,
    'qid, times, nextTime, lastTime',
    curriculum.userId
  );

  // 問題分を検索する
  const questions = await Promise.all(learnings.map((item) => QuestionService.describe(item.qid)));

  return {
    count: learnings.length,
    items: learnings.map((item) => {
      const question = questions.find((q) => q?.id === item.qid);

      return {
        ...item,
        question: question?.title,
      };
    }),
  };
};
