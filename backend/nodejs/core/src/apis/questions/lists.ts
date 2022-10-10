import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService, QuestionService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.QuestionListParams, any, APIs.QuestionListRequest, any>
): Promise<APIs.QuestionListResponse> => {
  const { groupId } = req.params;

  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new ValidationError('Group informations not found.');
  }

  // 問題一覧
  const questions = await QuestionService.listByGroup(groupId);

  return {
    count: questions.length,
    questions: questions,
  };
};
