import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService, LearningService, QuestionService } from '@services';

/** 問題削除 */
export default async (
  req: Request<APIs.QuestionDeleteParams, any, APIs.QuestionDeleteRequest, any>
): Promise<APIs.QuestionDeleteResponse> => {
  const { questionId, groupId } = req.params;

  // get all learning user
  const results = await LearningService.listByQuestion(questionId);

  // delete all records
  const tasks = results.map((item) => LearningService.remove(item.qid, item.userId));

  await Promise.all(tasks);

  // delete question
  await QuestionService.remove(questionId);
  // minus question count
  await GroupService.minusCount(groupId, 1);
};
