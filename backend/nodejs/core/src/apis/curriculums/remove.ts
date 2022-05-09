import { Request } from 'express';
import { Curriculums, Learning } from '@queries';
import { DBHelper } from '@utils';
import { APIs, Tables } from 'typings';
import { Environment } from '@consts';

export default async (
  req: Request<APIs.CurriculumRemoveParams, any, APIs.CurriculumRemoveRequest, any>
): Promise<APIs.CurriculumRemoveResponse> => {
  const curriculumId = req.params.curriculumId;

  const curriculum = await DBHelper().get<Tables.TCurriculums>(Curriculums.get({ id: curriculumId }));

  if (!curriculum?.Item) {
    throw new Error(`Curriculum[${curriculumId}] not found.`);
  }

  // group id
  const groupId = curriculum.Item.groupId;
  // get all learning datas
  const learning = await DBHelper().query<Tables.TLearning>(Learning.query.byGroupId(groupId));

  console.log(learning.Items);
  // execute all
  await Promise.all([
    // remove all learning records
    DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learning.Items),
    // remove curriculum
    DBHelper().delete<Tables.TCurriculums>(Curriculums.del({ id: curriculumId })),
  ]);
};
