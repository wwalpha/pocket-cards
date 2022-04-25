import { Request } from 'express';
import { Curriculums } from '@queries';
import { Commons, DBHelper } from '@utils';
import { APIs, Tables, Users } from 'typings';
import axios from 'axios';
import { Consts } from '@consts';

export default async (
  req: Request<any, any, APIs.CurriculumListsRequest, APIs.CurriculumListsQuery>
): Promise<APIs.CurriculumListsResponse> => {
  const subject = req.query.subject;
  const userId = Commons.getUserId(req);
  const userInfo = await getUserInfo(userId, req.headers['authorization']);

  // 保護者の場合
  if (userInfo.authority === Consts.Authority.PARENT) {
    // カリキュラム一覧取得
    const results = await DBHelper().query<Tables.TCurriculums>(Curriculums.query.byGuardian(userId));
    // 科目を絞る
    const response = results.Items.filter((item) => {
      if (!subject) return true;

      return item.subject === subject;
    });

    return {
      count: response.length,
      items: response,
    };
  }

  if (!userInfo.teacher) {
    throw new Error('Teacher is not exists.');
  }

  // 全生徒のカリキュラム一覧
  const results = await DBHelper().query<Tables.TCurriculums>(Curriculums.query.byGuardian(userInfo.teacher));
  //　生徒、科目を絞る
  const response = results.Items.filter((item) => item.userId === userId).filter((item) => {
    if (!subject) return true;

    return item.subject === subject;
  });

  return {
    count: response.length,
    items: response,
  };
};

const getUserInfo = async (userId: string, token?: string) => {
  // get user information
  const response = await axios.get<Users.DescribeUserResponse>(Consts.API_URLs.describeUser(userId), {
    headers: {
      authorization: token,
    },
  });

  // user not found
  if (response.status !== 200) {
    throw new Error('User not found.');
  }

  return response.data;
};
