import { Request } from 'express';
import { CurriculumService, LearningService } from '@services';
import { DBHelper } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.CurriculumRemoveParams, any, APIs.CurriculumRemoveRequest, any>
): Promise<APIs.CurriculumRemoveResponse> => {
  const curriculumId = req.params.curriculumId;

  // describe info
  const curriculum = await CurriculumService.describe(curriculumId);

  if (!curriculum) {
    throw new Error(`Curriculum[${curriculumId}] not found.`);
  }

  // group id
  const groupId = curriculum.groupId;

  // 普通グループ
  if (Consts.SUBJECT_NORMAL.includes(curriculum.subject)) {
    // get all learning datas
    const learning = await LearningService.listByGroup(groupId);

    // execute all
    await Promise.all([
      // remove all learning records
      DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learning),
      // remove curriculum
      CurriculumService.remove(curriculumId),
    ]);
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(curriculum.subject)) {
    // remove curriculum
    await CurriculumService.remove(curriculumId);
  }
};
