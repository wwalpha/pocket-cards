import { Request } from 'express';
import { DBHelper } from '@utils';
import { APIs, Tables } from 'typings';
import { Groups } from '@queries';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.GroupUpdateParams, void, APIs.GroupUpdateRequest, any>): Promise<void> => {
  const groupId = req.params.groupId;
  const item = req.body;

  const result = await DBHelper().get<Tables.TGroups>(
    Groups.get({
      id: groupId,
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
