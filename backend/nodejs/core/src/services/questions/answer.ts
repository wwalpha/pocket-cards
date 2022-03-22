import { Request } from 'express';
import { defaultTo } from 'lodash';
import { DateUtils, DBHelper } from '@utils';
import { Traces, Learning } from '@queries';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<APIs.QuestionAnswerParams, any, APIs.QuestionAnswerRequest, any>
): Promise<APIs.QuestionAnswerResponse> => {
  const input = req.body;
  const { questionId } = req.params;

  const result = await DBHelper().get<Tables.TLearning>(Learning.get({ qid: questionId }));
  const question = result?.Item;

  if (!question) {
    throw new Error(`Question not found. ${questionId}`);
  }

  // 正解の場合
  const times = input.correct === '1' ? defaultTo(question.times, 0) + 1 : 0;
  const nextTime = input.correct === '1' ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  // 登録実行
  await DBHelper().transactWrite({
    TransactItems: [
      {
        // 問題情報更新
        Put: Learning.put({
          ...question,
          times: times,
          nextTime: nextTime,
          lastTime: DateUtils.getNow(),
        }),
      },
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
