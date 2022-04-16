import { Request } from 'express';
import { DBHelper } from '@utils';
import { Groups, Learning, Questions } from '@queries';
import { APIs, Tables } from 'typings';

/** 問題削除 */
export default async (
  req: Request<APIs.QuestionDeleteParams, any, APIs.QuestionDeleteRequest, any>
): Promise<APIs.QuestionDeleteResponse> => {
  const { questionId, groupId } = req.params;

  // get all learning user
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.byQuestionId(questionId));

  // delete all records
  const tasks = results.Items.map((item) => DBHelper().delete(Learning.del({ qid: item.qid, userId: item.userId })));

  await Promise.all(tasks);

  // delete question
  await DBHelper().delete(
    Questions.del({
      id: questionId,
    })
  );

  // minus question count
  await DBHelper().update(Groups.update.minusCount({ id: groupId }, 1));
};
