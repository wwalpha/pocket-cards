import { Request } from 'express';
import { generate } from 'short-uuid';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { APIs } from 'typings';
import { GroupService } from '@services';

/**
 * グループ情報変更
 * PUT /groups/:groupId
 */
export default async (req: Request<any, any, APIs.GroupRegistRequest, any>): Promise<APIs.GroupRegistResponse> => {
  const item = req.body;
  const uuid = generate();

  const values = pickBy(item, (value) => {
    return !isEmpty(value);
  });

  // データ更新
  await GroupService.update({
    id: uuid,
    subject: item.subject,
    count: 0,
    ...values,
  });

  return {
    groupId: uuid,
  };
};
