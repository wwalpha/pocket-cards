import { Request } from 'express';
import { APIs } from 'typings';
import { AbilityService, GroupService, QuestionService } from '@services';
import { Consts, Environment } from '@consts';
import { DBHelper } from '@utils';

/**
 * グループ情報削除
 * DELETE /groups/:groupId
 */
export default async (req: Request<any, APIs.GroupRemoveRequest, any, any>): Promise<APIs.GroupRemoveResponse> => {
  const { groupId } = req.body;

  const groupInfo = await GroupService.describe(groupId);

  // not exists
  if (!groupInfo) return;

  // 一般グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    const questions = await QuestionService.listByGroup(groupInfo.id);

    // execute all
    await Promise.all([GroupService.remove(groupId), DBHelper().truncate(Environment.TABLE_NAME_QUESTIONS, questions)]);
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(groupInfo.subject)) {
    const questions = await AbilityService.listByKey(groupInfo.id);

    // execute all
    await Promise.all([
      GroupService.remove(groupId),
      DBHelper().truncate(Environment.TABLE_NAME_WEEKLY_ABILITY, questions),
    ]);
  }
};
