import { Request } from 'express';
import { Histories } from '@queries';
import { DBHelper, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import * as _ from 'lodash';

export default async (
  req: Request<any, any, APIs.LearningProgressRequest, any>
): Promise<APIs.LearningProgressResponse> => {
  const userId = Commons.getUserId(req);

  // 問題一覧
  const results = await DBHelper().query<Tables.THistories>(Histories.query.byUserId(userId));

  const items = _.orderBy(results.Items, ['timestamp', 'asc']);

  return {
    histories: items.map((item) => _.omit(item, ['userId'])),
  };
};
