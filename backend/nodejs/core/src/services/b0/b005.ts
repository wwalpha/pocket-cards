import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Groups } from '@queries';
import { APIs } from 'typings';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.B005Params, void, APIs.B004Request, any>): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = req.params.groupId;

  // データ更新
  await DBHelper().delete(
    Groups.del({
      id: groupId,
      userId: userId,
    })
  );
};
