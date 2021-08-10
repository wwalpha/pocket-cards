import { Request } from 'express';
import { DBHelper } from '@utils';
import { WordMaster } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<APIs.E001Params, any, any, any>): Promise<APIs.E001Response> => {
  const word = req.params.word;

  // 単語詳細情報を取得する
  const record = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(word));

  return {
    item: record?.Item,
  };
};
