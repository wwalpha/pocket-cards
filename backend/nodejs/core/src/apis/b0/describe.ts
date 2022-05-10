import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService } from '@services';

/**
 * グループ情報検索
 *
 * GET /groups/:groupId
 */
export default async (
  req: Request<APIs.GroupDescribeParams, any, APIs.GroupDescribeRequest, any>
): Promise<APIs.GroupDescribeResponse> => {
  const groupId = req.params.groupId;

  // 検索
  const result = await GroupService.describe(groupId);

  return {
    item: result,
  };
};
