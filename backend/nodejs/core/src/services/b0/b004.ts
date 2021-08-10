import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { APIs } from 'typings';
import { Groups } from '@queries';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.B004Params, void, APIs.B004Request, any>): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = req.params.groupId;
  const item = req.body;

  // データ更新
  await DBHelper().put(
    Groups.put({
      id: groupId,
      userId,
      name: item.name,
      count: 0,
      description: item.description,
    })
  );
};
