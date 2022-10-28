import { Request } from 'express';
import { DateUtils, Commons } from '@utils';
import { APIs } from 'typings';
import { Consts } from '@consts';
import { LearningService } from '@services';

export default async (req: Request<any, any, APIs.DailyTasksResquest, any>): Promise<APIs.DailyTasksResponse> => {
  const userId = Commons.getUserId(req);

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const tests = await Promise.all([
    LearningService.listTests(userId, Consts.SUBJECT.LANGUAGE),
    LearningService.listTests(userId, Consts.SUBJECT.SCIENCE),
    LearningService.listTests(userId, Consts.SUBJECT.SOCIETY),
  ]);
  // 完了問題一覧
  const archives = await Promise.all([
    LearningService.listTests(userId, Consts.SUBJECT.LANGUAGE, date),
    LearningService.listTests(userId, Consts.SUBJECT.SCIENCE, date),
    LearningService.listTests(userId, Consts.SUBJECT.SOCIETY, date),
  ]);

  return {
    language: {
      archive: archives[0].length,
      target: tests[0].length,
    },
    science: {
      archive: archives[1].length,
      target: tests[1].length,
    },
    society: {
      archive: archives[2].length,
      target: tests[2].length,
    },
  };
};
