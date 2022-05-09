import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

/** 単語詳細取得 */
export default async (req: Request<APIs.C003Params, any, any, any>): Promise<APIs.C003Response> => {
  const params = req.params;
  const result = await DBHelper().get<Tables.TWords>(Words.get({ id: params.word, groupId: params.groupId }));

  return {
    item: result?.Item,
  };
};
