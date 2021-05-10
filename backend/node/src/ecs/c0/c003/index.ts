import { Request } from 'express';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { API, Table } from 'typings';

export default async (req: Request<API.C003Params, any, any, any>): Promise<API.C003Response> => {
  const params = req.params;

  const result = await DBHelper().get(Words.get({ id: params.word, groupId: params.groupId }));

  return result.Item as Table.TWords;
};
