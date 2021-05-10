import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { API, Table } from 'typings';

/**
 * グループ情報検索
 *
 * GET /groups/:groupId
 */
export default async (req: Request): Promise<API.B003Response> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as API.B003Params).groupId;

  // 検索
  const results = await DBHelper().get(Groups.get({ id: groupId, userId }));

  Logger.info(results);

  return results.Item as Table.TGroups;
};
