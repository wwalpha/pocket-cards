import { Request } from 'express';
import { Histories } from '@queries';
import { DBHelper, DateUtils, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { Consts } from '@consts';
import * as _ from 'lodash';

export default async (
  req: Request<any, any, APIs.LearningProgressRequest, any>
): Promise<APIs.LearningProgressResponse> => {
  const userId = Commons.getUserId(req);

  // next study date
  const timestamp = DateUtils.getTimestamp();
  // 問題一覧
  const results = await DBHelper().query<Tables.THistories>(Histories.query.byUserId(userId, timestamp));

  const items = results.Items;

  return {
    language: getCount(items, Consts.SUBJECT.LANGUAGE),
    science: getCount(items, Consts.SUBJECT.SCIENCE),
    society: getCount(items, Consts.SUBJECT.SOCIETY),
  };
};

const getCount = (array: Tables.THistories[], subject: string): number => {
  // group by qid
  const grouped = _.groupBy(
    array.filter((a) => a.subject === subject),
    (item) => item.qid
  );
  // max timestamp -> times after answer -> filter 0 times -> count
  return _.map(grouped, (item) => _.maxBy(item, 'timestamp')?.timesAfter).filter((item) => item !== 0).length;
};
