import { DBHelper } from '@utils';
import { Tables } from 'typings';
import { byGroupId, byGuardian } from './queries';

export const getList = async () => {};

export const getListByGuardian = async (userId: string, subject?: string): Promise<Tables.TCurriculums[]> => {
  const results = await DBHelper().query<Tables.TCurriculums>(byGuardian(userId));

  // filter
  if (subject) {
    return results.Items.filter((item) => item.subject === subject);
  }

  return results.Items;
};

export const getListByGroup = async (groupId: string): Promise<Tables.TCurriculums[]> => {
  const results = await DBHelper().query<Tables.TCurriculums>(byGroupId(groupId));

  return results.Items;
};
