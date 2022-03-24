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
  const pastResults = await DBHelper().query<Tables.TLearning>(Learning.query.past(userId, date));
  const currentResults = await DBHelper().query<Tables.TLearning>(Learning.query.current(userId, date));

  return {
    language: {
      archive: getArchive(currentResults.Items, Consts.SUBJECT.LANGUAGE),
      target: getTarget(pastResults.Items, currentResults.Items, Consts.SUBJECT.LANGUAGE),
    },
    science: {
      archive: getArchive(currentResults.Items, Consts.SUBJECT.SCIENCE),
      target: getTarget(pastResults.Items, currentResults.Items, Consts.SUBJECT.SCIENCE),
    },
    society: {
      archive: getArchive(currentResults.Items, Consts.SUBJECT.SOCIETY),
      target: getTarget(pastResults.Items, currentResults.Items, Consts.SUBJECT.SOCIETY),
    },
  };
};

const getTarget = (past: Tables.TLearning[], current: Tables.TLearning[], subject: string): number => {
  const pastCount = past.filter((item) => item.subject === subject).filter((item) => item.times !== 0).length;
  const currentCount = current.filter((item) => item.subject === subject).length;

  return pastCount + currentCount;
};

const getArchive = (current: Tables.TLearning[], subject: string): number => {
  return current.filter((item) => item.subject === subject).length;
};
