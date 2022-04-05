import { Request } from 'express';
import { DBHelper } from '@utils';
import { Groups } from '@queries';
import { APIs, Tables } from 'typings';

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
  const results = await DBHelper().get<Tables.TGroups>(Groups.get({ id: groupId }));

  return {
    item: results?.Item,
  };
};
