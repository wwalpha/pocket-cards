import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<APIs.C002Params, any, any, any>): Promise<APIs.C002Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query<Tables.TWords>(Words.query.listByGroup(groupId));

  // 検索結果０件の場合
  if (queryResult.Items.length === 0) {
    return {
      count: 0,
      items: [],
    };
  }

  const items = queryResult.Items.map<APIs.C002ResItem>((item) => ({
    word: item.id,
    vocabulary: item.vocabulary,
  }));

  return {
    count: items.length,
    items,
  };
};
