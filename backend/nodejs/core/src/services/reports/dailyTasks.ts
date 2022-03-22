import { Request } from 'express';
import { Learning } from '@queries';
import { DBHelper, DateUtils, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { Consts } from '@consts';

export default async (req: Request<any, any, APIs.DailyTasksResquest, any>): Promise<APIs.DailyTasksResponse> => {
  const userId = Commons.getUserId(req);

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.daily(userId, date));

  return {
    language: {
      test: results.Items.filter((item) => item.subject === Consts.SUBJECT.LANGUAGE && item.times !== 0).length,
    },
    science: {
      test: results.Items.filter((item) => item.subject === Consts.SUBJECT.SCIENCE && item.times !== 0).length,
    },
    society: {
      test: results.Items.filter((item) => item.subject === Consts.SUBJECT.SOCIETY && item.times !== 0).length,
    },
  };
};
