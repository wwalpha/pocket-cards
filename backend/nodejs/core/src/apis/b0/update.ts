import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService } from '@services';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.GroupUpdateParams, void, APIs.GroupUpdateRequest, any>): Promise<void> => {
  const groupId = req.params.groupId;
  const item = req.body;

  // 詳細情報取得
  const result = await GroupService.describe(groupId);

  // if exists
  if (result) {
    // データ更新
    await GroupService.update({
      ...result,
      name: item.name,
      description: item.description,
    });
  }
};
