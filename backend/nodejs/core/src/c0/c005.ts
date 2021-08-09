import { Request } from 'express';
import { DBHelper } from '@utils';
import { Groups, Words } from '@queries';
import { getUserId } from '@src/utils/commons';
import { APIs } from 'typings';

/** グループ単語削除 */
export default async (req: Request<APIs.C005Params, any, any, any>): Promise<APIs.C005Response> => {
  const params = req.params;
  const userId = getUserId(req);

  await DBHelper().transactWrite({
    TransactItems: [
      {
        // 単語情報削除
        Delete: Words.del({ id: params.word, groupId: params.groupId }),
      },
      {
        // グループ単語数更新
        Update: Groups.update.minusCount(params.groupId, userId, 1),
      },
    ],
  });
};
