import { Request } from 'express';
import { APIs } from 'typings';
import { LearningService } from '@services';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.LearningDescribeParams, any, APIs.LearningDescribeRequest, APIs.LearningDescribeQuery>
): Promise<APIs.LearningDescribeResponse> => {
  const { qid } = req.params;
  const { uid } = req.query;

  // parameter validation
  if (!qid || !uid) {
    throw new ValidationError('Required parameters were not found.');
  }

  // learning information
  const infos = await LearningService.describe(qid, uid);

  // not found
  if (!infos) {
    throw new ValidationError('Learning information not found.');
  }

  return infos;
};
