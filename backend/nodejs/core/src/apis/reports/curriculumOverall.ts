import { Request } from 'express';
import { isEmpty } from 'lodash';
import { APIs } from 'typings';
import { CurriculumService, LearningService } from '@services';
import { Commons, ValidationError } from '@utils';
import { Consts } from '@consts';

export default async (
  req: Request<any, any, APIs.CurriculumOverallResquest, any>
): Promise<APIs.CurriculumOverallResponse> => {
  const { curriculums } = req.body;

  if (isEmpty(curriculums) || curriculums.length === 0) {
    throw new ValidationError('Required parameter is not found.');
  }

  const tasks = curriculums.map<Promise<APIs.CurriculumOverallResponseItem | undefined>>(async (c) => {
    const curriculum = await CurriculumService.describe(c);

    // validation
    if (!curriculum) {
      return;
    }

    // 日次学習進捗
    const learnings = await LearningService.listByGroup(curriculum.groupId, curriculum.userId, 'lastTime, times');

    return {
      id: c,
      progress: [
        learnings.filter((item) => item.times === Commons.getRegistTimes(item.subject) && item.lastTime === Consts.INITIAL_DATE).length,
        learnings.filter((item) => item.times === Commons.getRegistTimes(item.subject) && item.lastTime !== Consts.INITIAL_DATE).length,
        learnings.filter((item) => item.times === 1).length,
        learnings.filter((item) => item.times === 2).length,
        learnings.filter((item) => item.times === 3).length,
        learnings.filter((item) => item.times === 4).length,
        learnings.filter((item) => item.times === 5).length,
        learnings.filter((item) => item.times === 6).length,
        learnings.filter((item) => item.times === 7).length,
        learnings.filter((item) => item.times === 8).length,
      ],
    };
  });

  const results = await Promise.all(tasks);

  return {
    items: results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  };
};
