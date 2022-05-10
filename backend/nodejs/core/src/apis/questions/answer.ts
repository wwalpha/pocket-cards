import { Request } from 'express';
import { defaultTo } from 'lodash';
import { Commons, DateUtils, DBHelper } from '@utils';
import { Traces } from '@queries';
import { APIs } from 'typings';
import { LearningService } from '@services';

export default async (
  req: Request<APIs.QuestionAnswerParams, any, APIs.QuestionAnswerRequest, any>
): Promise<APIs.QuestionAnswerResponse> => {
  const input = req.body;
  const userId = Commons.getUserId(req);
  const { questionId } = req.params;

  const result = await LearningService.describe(questionId, userId);

  const question = result;

  if (!question) {
    throw new Error(`Question not found. ${questionId}`);
  }

  // 正解の場合
  const times = input.correct === '1' ? defaultTo(question.times, 0) + 1 : 0;
  const nextTime = input.correct === '1' ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  // 学習情報更新
  await LearningService.update({
    ...question,
    times: times,
    nextTime: nextTime,
    lastTime: DateUtils.getNow(),
  });

  // 登録実行
  await DBHelper().transactWrite({
    TransactItems: [
      {
        // 履歴登録
        Put: Traces.put({
          qid: question.qid,
          timestamp: DateUtils.getTimestamp(),
          groupId: question.groupId,
          userId: question.userId,
          subject: question.subject,
          timesBefore: question.times,
          timesAfter: times,
          lastTime: question.lastTime,
        }),
      },
    ],
  });
};
