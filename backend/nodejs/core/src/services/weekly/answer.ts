import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { WeeklyTest } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (
  req: Request<APIs.WeeklyTestAnswerParameter, any, APIs.WeeklyTestAnswerRequest, any>
): Promise<APIs.WeeklyTestAnswerResponse> => {
  // user id
  const userId = Commons.getUserId(req);
  // question id
  const { qid } = req.params;
  const { subject, correct } = req.body;

  const result = await DBHelper().get<Tables.TweeklyTest>(
    WeeklyTest.get({
      userId: userId,
      subjectQid: `${subject}_${qid}`,
    })
  );

  const question = result?.Item;

  if (!question) {
    throw new Error(`Question not found. ${qid}`);
  }

  // 正解の場合
  const times = correct === '1' ? question.times + 1 : question.times;

  if (times === 5) {
    await DBHelper().delete(WeeklyTest.del({ userId, subjectQid: `${subject}_${qid}` }));
  } else {
    await DBHelper().put(
      WeeklyTest.put({
        ...question,
        times,
      })
    );
  }
};
