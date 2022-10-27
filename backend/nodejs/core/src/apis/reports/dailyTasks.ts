import { Request } from 'express';
import { DateUtils, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { Consts } from '@consts';
import { LearningService } from '@services';

export default async (req: Request<any, any, APIs.DailyTasksResquest, any>): Promise<APIs.DailyTasksResponse> => {
  const userId = Commons.getUserId(req);

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const pastResults = await LearningService.dailyPastTasks(userId, date);
  const currentResults = await LearningService.dailyCurrentTasks(userId, date);

  return {
    language: {
      archive: getArchive(currentResults, Consts.SUBJECT.LANGUAGE, date),
      target: getTarget(pastResults, currentResults, Consts.SUBJECT.LANGUAGE),
    },
    science: {
      archive: getArchive(currentResults, Consts.SUBJECT.SCIENCE, date),
      target: getTarget(pastResults, currentResults, Consts.SUBJECT.SCIENCE),
    },
    society: {
      archive: getArchive(currentResults, Consts.SUBJECT.SOCIETY, date),
      target: getTarget(pastResults, currentResults, Consts.SUBJECT.SOCIETY),
    },
  };
};

const getTarget = (past: Tables.TLearning[], current: Tables.TLearning[], subject: string): number => {
  const pastCount = past.filter((item) => item.subject === subject).filter((item) => item.times !== 0).length;
  const currentCount = current.filter((item) => item.subject === subject).length;

  return pastCount + currentCount;
};

// 対象科目、且つ
const getArchive = (current: Tables.TLearning[], subject: string, date: string): number => {
  return current.filter((item) => item.subject === subject).filter((item) => item.nextTime <= date).length;
};
