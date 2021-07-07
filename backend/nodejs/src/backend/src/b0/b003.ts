import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { APIs, Tables } from 'typings';

/**
 * グループ情報検索
 *
 * GET /groups/:groupId
 */
export default async (req: Request<APIs.B003Params, any, APIs.B001Request, any>): Promise<APIs.B003Response> => {
  const userId = Commons.getUserId(req);
  const groupId = req.params.groupId;

  // 検索
  const results = await DBHelper().get<Tables.TGroups>(Groups.get({ id: groupId, userId }));

  Logger.info(results);

  return results?.Item;
};
