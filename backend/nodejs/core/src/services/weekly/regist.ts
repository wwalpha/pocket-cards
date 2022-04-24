import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Groups, Questions } from '@queries';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (
  req: Request<any, any, APIs.WeeklyTestRegistRequest, any>
): Promise<APIs.WeeklyTestRegistResponse> => {
  // next study date
  const { groupIds } = req.body;
  const userId = Commons.getUserId(req);

  if (!groupIds || groupIds.length === 0) {
    throw new Error('Group ids is required.');
  }

  // group informations
  const tasks = groupIds.map(async (item) => {
    const groupInfo = await DBHelper().get<Tables.TGroups>(Groups.get({ id: item }));

    // group id not found
    if (!groupInfo) return;

    // get  questions
    const questions = await DBHelper().query<Tables.TQuestions>(Questions.query.byGroupId(item));

    // make insert records
    const records = questions.Items.map<Tables.TweeklyTest>((item) => ({
      userId: userId,
      subjectQid: `${groupInfo.Item?.subject}_${item.id}`,
      times: 0,
    }));

    // insert records
    await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_TEST, records);
  });

  // bulk insert
  await Promise.all(tasks);
};
