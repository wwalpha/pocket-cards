import { Request } from 'express';
import { Curriculums } from '@queries';
import { Commons, DBHelper } from '@utils';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<any, any, APIs.CurriculumListsRequest, any>
): Promise<APIs.CurriculumListsResponse> => {
  const userId = Commons.getUserId(req);

  const results = await DBHelper().query<Tables.TCurriculums>(Curriculums.query.byGuardian(userId));

  return {
    count: results.Items.length,
    items: results.Items,
  };
};
