import { Request } from 'express';
import { AbilityService, CurriculumService, GroupService, QuestionService } from '@services';
import { Consts } from '@consts';
import { ValidationError } from '@utils';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.CurriculumQuestionsParams, any, APIs.CurriculumQuestionsRequest, any>
): Promise<APIs.CurriculumQuestionsResponse> => {
  const { curriculumId } = req.params;

  // カリキュラム
  const curriculumInfo = await CurriculumService.describe(curriculumId);

  if (!curriculumInfo) {
    throw new ValidationError('Curriculum not found.');
  }

  // グループ
  const groupInfo = await GroupService.describe(curriculumInfo.groupId);

  if (!groupInfo) {
    throw new ValidationError('Group not found.');
  }

  // 一般グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    const results = await QuestionService.listByGroup(groupInfo.id);

    return {
      count: results.length,
      items: results,
    };
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(groupInfo.subject)) {
    const results = await AbilityService.listByKey(groupInfo.id);

    const tasks = results.map((item) => QuestionService.describe(item.qid));
    const questions = await Promise.all(tasks);

    return {
      count: results.length,
      items: questions.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
    };
  }

  return {
    count: 0,
    items: [],
  };
};
