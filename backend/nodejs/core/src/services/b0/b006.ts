import { Request } from 'express';
import { DBHelper, DateUtils } from '@utils';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

/**
 * グループ情報検索
 *
 * GET /groups/:groupId/status
 */
export default async (req: Request<APIs.B006Params, any, APIs.B006Request, any>): Promise<APIs.B006Response> => {
  const groupId = req.params.groupId;

  // 検索
  const results = await DBHelper().query<Tables.TWords>(Words.query.listByGroup(groupId));

  const count = results.Items.length;
  const learned = results.Items.filter((item) => item.times > 1).length;
  const unlearned = results.Items.filter((item) => item.times === 0).length;
  const review = results.Items.filter((item) => item.times === 1).length;
  const untested = results.Items.filter((item) => item.nextTime <= DateUtils.getNow()).length;

  return {
    count,
    learned,
    unlearned,
    review,
    untested,
  };
};
