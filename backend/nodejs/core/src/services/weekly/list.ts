import { Request } from 'express';
import { DBHelper } from '@utils';
import { Questions, WeeklyAbility } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (
  req: Request<any, any, APIs.WeeklyTestListRequest, APIs.WeeklyTestListQuery>
): Promise<APIs.WeeklyTestListResponse> => {
  // parameters
  const { groupId } = req.params;

  // results
  const results = await DBHelper().query<Tables.TWeeklyAbility>(WeeklyAbility.query.byKey(groupId));

  // no questions
  if (results.Items.length === 0) {
    return {
      count: 0,
      questions: [],
    };
  }

  // get question details
  const tasks = results.Items.map((item) => DBHelper().get<Tables.TQuestions>(Questions.get({ id: item.qid })));

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
