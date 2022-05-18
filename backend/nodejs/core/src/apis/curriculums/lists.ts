import { Request } from 'express';
import { CurriculumService, UserService } from '@services';
import { Consts } from '@consts';
import { Commons, ValidationError } from '@utils';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.CurriculumListsRequest, APIs.CurriculumListsQuery>
): Promise<APIs.CurriculumListsResponse> => {
  const subject = req.query.subject;
  const userId = Commons.getUserId(req);
  const userInfo = await UserService.getUserInfo(userId, req.headers['authorization']);

  // 保護者の場合
  if (userInfo.authority !== Consts.Authority.PARENT) {
    throw new ValidationError('Guardian access only.');
  }

  // カリキュラム一覧取得
  const results = await CurriculumService.getListByGuardian(userId, subject);

  return {
    count: results.length,
    items: results,
  };
};
