import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Groups, Words } from '@queries';
import { APIs } from 'typings';
import { Environment } from '@consts';

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

  const groupWords = await DBHelper().query(Words.query.listByGroup(groupId));

  // remove all words in group
  await DBHelper().truncate(Environment.TABLE_NAME_WORDS, groupWords.Items);
};
