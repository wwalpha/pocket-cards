import { Request } from 'express';
import { APIs } from 'typings';
import { QuestionService } from '@services';

// @deprecated
export default async (
  req: Request<APIs.QuestionListParams, any, APIs.QuestionListRequest, any>
): Promise<APIs.QuestionListResponse> => {
  const groupId = req.params.groupId;

  const results = await QuestionService.listByGroup(groupId);

  return {
    count: results.length,
    questions: results,
  };
};
