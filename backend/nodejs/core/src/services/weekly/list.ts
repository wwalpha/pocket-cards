import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Questions, WeeklyTest } from '@queries';
import { APIs, Tables } from 'typings';
import { minBy } from 'lodash';

/** 今日のテスト */
export default async (
  req: Request<any, any, APIs.WeeklyTestListRequest, any>
): Promise<APIs.WeeklyTestListResponse> => {
  // subject
  const { subject } = req.body;
  const userId = Commons.getUserId(req);

  // get test questions
  const tests = await DBHelper().query<Tables.TweeklyTest>(WeeklyTest.query.bySubject(userId, subject));

  // no questions
  if (tests.Items.length === 0) {
    return {
      count: 0,
      questions: [],
    };
  }

  // calculate min times
  const times = minBy(tests.Items, 'times')?.times || 0;
  // get min times question
  const questions = tests.Items.filter((item) => item.times === times);
  // get question details
  const tasks = questions.map((item) =>
    DBHelper().get<Tables.TQuestions>(Questions.get({ id: item.subjectQid.split('_')[1] || '' }))
  );

  const details = await Promise.all(tasks);

  // make response
  const response = details
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  return {
    count: response.length,
    questions: response,
  };
};
