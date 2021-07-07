import { Request, Response } from 'express';
import { Logger } from '@utils';
import { APIs } from 'typings';

export default async (req: Request, res: Response, callback: APIs.Callback) => {
  // イベントログ;
  try {
    // 認証
    // await validate(event);
    // 本処理
    const result = await callback(req);

    // 本処理結果
    console.log(result);

    res.status(200).send(result);
  } catch (error) {
    // エラーログ
    console.log(error);

    res.status(500).send(error);
  }
};
