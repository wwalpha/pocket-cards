import { Request } from 'express';
import { APIs } from 'typings';
import { Commons } from '@utils';
import study from './study';
import update from './update';

export default async (req: Request<APIs.C004Params, any, APIs.C004Request, any>): Promise<APIs.C004Response> => {
  const input = req.body;
  const userId = Commons.getUserId(req);

  // 学習カード
  if (input.type === '1') {
    // 学習カード
    study(req.params, input, userId);
  }

  // 単語更新
  if (input.type === '2') {
    update(req.params, input);
  }
};
