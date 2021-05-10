import { Request } from 'express';
import { DBHelper } from '@utils';
import { WordMaster } from '@queries';
import { API, Table } from 'typings';

export default async (req: Request<API.E001Params, any, any, any>): Promise<API.E001Response> => {
  const word = req.params.word;

  // 単語詳細情報を取得する
  const record = await DBHelper().get(WordMaster.get(word));

  return record.Item as Table.TWordMaster;
};
