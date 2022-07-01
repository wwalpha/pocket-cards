import { Request } from 'express';
import { isEmpty } from 'lodash';
import { APIs } from 'typings';
import { LearningService, QuestionService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<any, any, APIs.OverallStatusResquest, APIs.OverallStatusQuery>
): Promise<APIs.OverallStatusResponse> => {
  const { userId, groupId } = req.query;

  if (isEmpty(userId) || isEmpty(groupId)) {
    throw new ValidationError('Required parameter is not found.');
  }

  // 日次学習進捗
  const learnings = await LearningService.listByUser(userId, groupId);

  const tasks = learnings.map<Promise<APIs.OverallStatusResponseItem | undefined>>(async (item) => {
    const question = await QuestionService.describe(item.qid);

    if (!question) return undefined;

    return {
      qid: item.qid,
      times: item.times,
      title: question.title,
    };
  });

  const results = await Promise.all(tasks);

  return {
    items: results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  };
};
