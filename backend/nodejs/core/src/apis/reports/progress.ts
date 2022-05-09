import { Request } from 'express';
import { Reports } from '@queries';
import { DBHelper, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import * as _ from 'lodash';

export default async (
  req: Request<any, any, APIs.LearningProgressRequest, any>
): Promise<APIs.LearningProgressResponse> => {
  const userId = Commons.getUserId(req);

  // 問題一覧
  const results = await DBHelper().query<Tables.TReports>(Reports.query.byDailyProgress(userId));

  const items = _.orderBy(results.Items, ['typeDate', 'asc']);

  return {
    histories: items.map((item) => ({
      timestamp: item.typeDate.split('_')[2] as string,
      japanese: item.japanese,
      science: item.science,
      society: item.society,
    })),
  };
};
