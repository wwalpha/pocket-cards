import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService, LearningService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.GroupStatusParams, any, APIs.GroupStatusRequest, any>
): Promise<APIs.GroupStatusResponse> => {
  const { groupId } = req.params;
  const { userId } = req.body;

  // validation
  if (!userId) {
    throw new ValidationError('User id required.');
  }

  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new ValidationError('Group informations not found.');
  }

  // 問題一覧
  const learnings = await LearningService.listByGroupWithProjection(groupId, 'qid, times, nextTime, lastTime', userId);

  return {
    count: learnings.length,
    items: learnings,
  };
};
