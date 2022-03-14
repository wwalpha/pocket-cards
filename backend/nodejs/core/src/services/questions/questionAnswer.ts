import { Request } from 'express';
import { defaultTo } from 'lodash';
import { DateUtils, DBHelper } from '@utils';
import { Learning } from '@queries';
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

  // 問題情報更新
  await DBHelper().put(
    Learning.put({
      ...question,
      times: times,
      nextTime: nextTime,
    })
  );
};
