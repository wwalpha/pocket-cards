import { Request } from 'express';
import { APIs, Tables } from 'typings';
import { GroupService, LearningService, QuestionService } from '@services';
import { Commons } from '@utils';

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

  const qInfo = await QuestionService.describe(questionId);

  // if image exist, delete file from s3 async
  checkImageExist(qInfo);

  // delete question
  await QuestionService.remove(questionId);
  // minus question count
  await GroupService.minusCount(groupId, 1);
};

const checkImageExist = async (question: Tables.TQuestions | undefined) => {
  if (question?.title) {
    await Commons.removeImage(question.title);
  }

  if (question?.answer) {
    await Commons.removeImage(question.answer);
  }
};
