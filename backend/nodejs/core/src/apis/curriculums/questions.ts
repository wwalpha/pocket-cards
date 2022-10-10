import { Request } from 'express';
import { CurriculumService, GroupService, QuestionService } from '@services';
import { ValidationError } from '@utils';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.CurriculumQuestionsParams, any, APIs.CurriculumQuestionsRequest, any>
): Promise<APIs.CurriculumQuestionsResponse> => {
  const { curriculumId } = req.params;

  // カリキュラム
  const curriculumInfo = await CurriculumService.describe(curriculumId);

  if (!curriculumInfo) {
    throw new ValidationError(`Curriculum[${curriculumId}] not found.`);
  }

  // グループ
  const groupInfo = await GroupService.describe(curriculumInfo.groupId);

  if (!groupInfo) {
    throw new ValidationError('Group not found.');
  }

  const results = await QuestionService.listByGroup(groupInfo.id);

  return {
    count: results.length,
    items: results,
  };
};
