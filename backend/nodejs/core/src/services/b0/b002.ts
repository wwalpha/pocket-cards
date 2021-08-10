import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Groups } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<any, any, APIs.B002Request, any>): Promise<APIs.B002Response> => {
  const userId = Commons.getUserId(req);

  // 検索結果
  const results = await DBHelper().query<Tables.TGroups>(Groups.query.byUserId(userId));
  const items = results.Items;

  // ０件
  if (items.length === 0) {
    return {
      count: 0,
      items: [],
    };
  }

  return {
    count: items.length,
    items,
  };
};
