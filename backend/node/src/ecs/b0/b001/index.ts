import { Request } from 'express';
import { generate } from 'short-uuid';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { DBHelper, Commons } from '@utils';
import { API } from 'typings';
import { Groups } from '@queries';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request): Promise<API.B001Response> => {
  const userId = Commons.getUserId(req);
  const item = req.body as API.B001Request;
  const uuid = generate();

  const values = pickBy(item, (value) => {
    return !isEmpty(value);
  });

  // データ更新
  await DBHelper().put(
    Groups.put({
      id: uuid,
      userId,
      ...values,
    })
  );

  return {
    groupId: uuid,
  };
};
