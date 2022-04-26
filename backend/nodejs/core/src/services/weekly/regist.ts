import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Questions, WeeklyTest } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (
  req: Request<any, any, APIs.WeeklyTestRegistRequest, any>
): Promise<APIs.WeeklyTestRegistResponse> => {
  // next study date
  const { qid } = req.body;
  const userId = Commons.getUserId(req);

  // get  questions
  const result = await DBHelper().get<Tables.TQuestions>(Questions.get({ id: qid }));
  const question = result?.Item;

  // make insert records
  const records: Tables.TWeeklyTest = {
    userId: userId,
    subjectQid: `${question?.subject}_${qid}`,
    times: 0,
  };

  // insert records
  await DBHelper().put(WeeklyTest.put(records));
};
