import { Request } from 'express';
import { CurriculumService } from '@services';
import { Learning } from '@queries';
import { DBHelper } from '@utils';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<APIs.CurriculumRemoveParams, any, APIs.CurriculumRemoveRequest, any>
): Promise<APIs.CurriculumRemoveResponse> => {
  const curriculumId = req.params.curriculumId;

  const curriculum = await CurriculumService.describe(curriculumId);

  if (!curriculum) {
    throw new Error(`Curriculum[${curriculumId}] not found.`);
  }

  // group id
  const groupId = curriculum.groupId;
  // get all learning datas
  const learning = await DBHelper().query<Tables.TLearning>(Learning.query.byGroupId(groupId));

  // execute all
  await Promise.all([
    // remove all learning records
    DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learning.Items),
    // remove curriculum
    CurriculumService.remove(curriculumId),
  ]);
};
