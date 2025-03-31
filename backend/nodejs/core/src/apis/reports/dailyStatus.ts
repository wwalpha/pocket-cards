import { Request } from 'express';
import { DateUtils, Commons } from '@utils';
import { APIs } from 'typings';
import { Consts } from '@consts';
import { LearningService, TraceService } from '@services';

export default async (req: Request<any, any, APIs.DailyTasksResquest, any>): Promise<APIs.DailyTasksResponse> => {
  const userId = Commons.getUserId(req);

  // next study date
  const date = DateUtils.getNow();
  // 問題一覧
  const targets = await Promise.all([
    LearningService.listTests(userId, Consts.SUBJECT.LANGUAGE),
    LearningService.listTests(userId, Consts.SUBJECT.SCIENCE),
    LearningService.listTests(userId, Consts.SUBJECT.SOCIETY),
  ]);

  // 完了問題一覧
  const results = await TraceService.listDailyStatus(userId, date);
  const languages = results.filter((r) => r.subject === Consts.SUBJECT.LANGUAGE);
  const sciences = results.filter((r) => r.subject === Consts.SUBJECT.SCIENCE);
  const societies = results.filter((r) => r.subject === Consts.SUBJECT.SOCIETY);

  return {
    language: {
      test: languages.filter((r) => r.timesBefore > 0).length,
      unlearned: languages.filter(
        (r) => r.lastTime === Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1
      ).length,
      relearning: languages.filter(
        (r) => r.lastTime !== Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1
      ).length,
      target: targets[0].length,
    },
    science: {
      test: sciences.filter((r) => r.timesBefore > 0).length,
      unlearned: sciences.filter((r) => r.lastTime === Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1)
        .length,
      relearning: sciences.filter(
        (r) => r.lastTime !== Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1
      ).length,
      target: targets[1].length,
    },
    society: {
      test: societies.filter((r) => r.timesBefore > 0).length,
      unlearned: societies.filter(
        (r) => r.lastTime === Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1
      ).length,
      relearning: societies.filter(
        (r) => r.lastTime !== Consts.INITIAL_DATE && r.timesBefore === 0 && r.timesAfter === 1
      ).length,
      target: targets[2].length,
    },
  };
};
