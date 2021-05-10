import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { API, Table } from 'typings';

export default async (req: Request<API.C002Params, any, any, any>): Promise<API.C002Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query(Words.query.listByGroup(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return [] as API.C002Response;
  }

  return queryResult.Items.map(
    (item) =>
      ({
        word: (item as Table.TWords).id,
        vocabulary: (item as Table.TWords).vocabulary,
      } as API.C002ResItem)
  );
};
