import express from 'express';
import { DBHelper, getUserId } from '@utils';
import { Curriculums, Groups, Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';
import { DescribeUser } from '@api';

export const ListCurriculums = async (
  req: express.Request<Users.GetUserCurriculumsParameter, any, Users.GetUserCurriculumsRequest>
): Promise<Users.GetUserCurriculumsResponse> => {
  // filters
  const subject = req.query.subject;
  // user id
  const userId = getUserId(req);
  // get user id from token
  const userInfo = await DescribeUser(req);

  if (!userInfo.teacher) {
    throw new Error('Teacher is not exists.');
  }

  // 全生徒のカリキュラム一覧
  const results = await DBHelper.query<Tables.TCurriculums>(Curriculums.query.byGuardian(userInfo.teacher));
  //　生徒、科目を絞る
  const curriculums = results.Items.filter((item) => item.userId === userId).filter((item) => {
    if (!subject) return true;

    return item.subject === subject;
  });

  const tasks = curriculums.map(async (item) => {
    const groupInfo = await DBHelper.get<Tables.TGroups>(Groups.get({ id: item.groupId }));

    return {
      ...item,
      groupName: groupInfo?.Item?.name,
    };
  });

  const response = await Promise.all(tasks);

  return {
    count: response.length,
    items: response,
  };
};
