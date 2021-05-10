import { Request } from 'express';
import { DBHelper, Logger, Commons } from '@utils';
import { Groups } from '@queries';
import { API } from 'typings';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = ((req.params as unknown) as API.B005Params).groupId;

  // データ更新
  await DBHelper().delete(
    Groups.del({
      id: groupId,
      userId: userId,
    })
  );
};
