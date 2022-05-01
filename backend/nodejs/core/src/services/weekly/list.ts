import { Request } from 'express';
import { DBHelper } from '@utils';
import { Questions, WeeklyAbility } from '@queries';
import { APIs, Tables } from 'typings';
import { Environment } from '@consts';

/** 今日のテスト */
export default async (
  req: Request<APIs.WeeklyTestListParameter, any, APIs.WeeklyTestListRequest, APIs.WeeklyTestListQuery>
): Promise<APIs.WeeklyTestListResponse> => {
  // parameters
  const { groupId } = req.params;
  const { reset } = req.query;

  // results
  let questions = await getQuestions(groupId);

  // no questions
  if (questions.filter((item) => item.times >= 0).length === 0) {
    if (reset !== '1') {
      return {
        count: 0,
        questions: [],
      };
    }

    // リセット質問
    questions = await resetTimes(questions);
  }

  // times >= 0
  questions = questions.filter((item) => item.times >= 0);

  // get question details
  const tasks = questions.map((item) => DBHelper().get<Tables.TQuestions>(Questions.get({ id: item.qid })));

  const details = await Promise.all(tasks);

  // make response
  const response = details
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map((item) => ({ ...item, groupId: groupId }));

  return {
    count: response.length,
    questions: response,
  };
};

const getQuestions = async (groupId: string): Promise<Tables.TWeeklyAbility[]> => {
  const results = await DBHelper().query<Tables.TWeeklyAbility>(WeeklyAbility.query.byKey(groupId));

  return results.Items.map((item) => item);
};

const resetTimes = async (questions: Tables.TWeeklyAbility[]) => {
  const items = questions.map((item) => ({
    ...item,
    times: 0,
  }));

  await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, items);

  return items;
};
