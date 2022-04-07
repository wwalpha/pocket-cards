import express from 'express';
import { DBHelper, getUserId } from '@utils';
import { Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';

export const ListStudents = async (
  req: express.Request<any, any, Users.GetStudentRequest>
): Promise<Users.GetStudentResponse> => {
  // get user id from token
  const userId = getUserId(req);

  const result = await DBHelper.query<Tables.TUsers>(UserQueries.query.byTeacher(userId));
  const students = result.Items;

  // not exists
  if (!students || students.length === 0) {
    return {
      count: 0,
      items: [],
    };
  }

  // get all user infomartions
  const tasks = students.map((item) => DBHelper.get<Tables.TUsers>(UserQueries.get(item.id)));
  const results = await Promise.all(tasks);
  const res = results
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  return {
    count: res.length,
    items: res,
  };
};
