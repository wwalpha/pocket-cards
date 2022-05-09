import { Request } from 'express';
import { DBHelper } from '@utils';
import { Groups } from '@queries';
import { APIs } from 'typings';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<APIs.GroupRemoveParams, void, any, any>): Promise<void> => {
  const groupId = req.params.groupId;

  // データ更新
  await DBHelper().delete(
    Groups.del({
      id: groupId,
    })
  );

  // const groupWords = await DBHelper().query(Words.query.listByGroup(groupId));

  // remove all words in group
  // await DBHelper().truncate(Environment.TABLE_NAME_WORDS, groupWords.Items);
};
