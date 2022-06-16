import { Request } from 'express';
import { AbilityService, CurriculumService, GroupService, LearningService, QuestionService } from '@services';
import { Consts } from '@consts';
import { APIs } from 'typings';

/**
 * グループ情報削除
 * DELETE /groups/:groupId
 */
export default async (req: Request<APIs.GroupRemoveParams, any, any, any>): Promise<APIs.GroupRemoveResponse> => {
  const { groupId } = req.params;

  // describe
  const groupInfo = await GroupService.describe(groupId);

  // not exists
  if (!groupInfo) return;

  // 一般グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    const questions = await QuestionService.listByGroup(groupInfo.id);
    const curriculums = await CurriculumService.getListByGroup(groupInfo.id);
    const learnings = await LearningService.listByGroup(groupInfo.id);

    // execute all
    await Promise.all([
      // remove group
      GroupService.remove(groupId),
      // remove group questions
      QuestionService.truncate(questions),
      // remove curriculum
      CurriculumService.truncate(curriculums),
      // remove learnings
      LearningService.truncate(learnings),
    ]);
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(groupInfo.subject)) {
    const questions = await AbilityService.listByKey(groupInfo.id);
    const curriculums = await CurriculumService.getListByGroup(groupInfo.id);

    // execute all
    await Promise.all([
      // remove group
      GroupService.remove(groupId),
      // remove curriculum
      CurriculumService.truncate(curriculums),
      // remove weekly questions
      AbilityService.truncate(questions),
    ]);
  }
};
