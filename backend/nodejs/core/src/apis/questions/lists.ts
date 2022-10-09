import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService, QuestionService } from '@services';
import { Consts } from '@consts';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.QuestionListParams, any, APIs.QuestionListRequest, any>
): Promise<APIs.QuestionListResponse> => {
  const { groupId } = req.params;

  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new ValidationError('Group informations not found.');
  }

  // 普通グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    const questions = await QuestionService.listByGroup(groupId);

    return {
      count: questions.length,
      questions: questions,
    };
  }

  return {
    count: 0,
    questions: [],
  };
};
