import { Request } from 'express';
import axios from 'axios';
import { CurriculumService } from '@services';
import { Consts } from '@consts';
import { Commons } from '@utils';
import { APIs, Users } from 'typings';

export default async (
  req: Request<any, any, APIs.CurriculumListsRequest, APIs.CurriculumListsQuery>
): Promise<APIs.CurriculumListsResponse> => {
  const subject = req.query.subject;
  const userId = Commons.getUserId(req);
  const userInfo = await getUserInfo(userId, req.headers['authorization']);

  // 保護者の場合
  if (userInfo.authority === Consts.Authority.PARENT) {
    // カリキュラム一覧取得
    const results = await CurriculumService.getListByGuardian(userId, subject);

    return {
      count: results.length,
      items: results,
    };
  }

  if (!userInfo.teacher) {
    throw new Error('Teacher is not exists.');
  }

  // 全生徒のカリキュラム一覧
  const results = await CurriculumService.getListByGuardian(userId, subject);

  return {
    count: results.length,
    items: results,
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
