import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { Groups } from '@queries';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.B004Params, void, APIs.B004Request, any>): Promise<void> => {
  const userId = Commons.getUserId(req);
  const groupId = req.params.groupId;
  const item = req.body;

  const result = await DBHelper().get<Tables.TGroups>(
    Groups.get({
      id: groupId,
      userId: userId,
    })
  );

  if (result?.Item) {
    // データ更新
    await DBHelper().put(
      Groups.put({
        ...result.Item,
        name: item.name,
        description: item.description,
      })
    );
  }
};
