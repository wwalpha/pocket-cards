import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<APIs.C002Params, any, any, any>): Promise<APIs.C002Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query<Tables.TWords>(Words.query.listByGroup(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as APIs.C002Response;
  }

  return queryResult.Items.map(
    (item) =>
      ({
        word: item.id,
        vocabulary: item.vocabulary,
      } as APIs.C002ResItem)
  );
};
