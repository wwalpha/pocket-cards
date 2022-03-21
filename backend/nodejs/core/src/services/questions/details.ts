import { Request } from 'express';
import { Questions } from '@queries';
import { DBHelper } from '@utils';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<APIs.QuestionDetailsParams, any, APIs.QuestionDetailsRequest, any>
): Promise<APIs.QuestionDetailsResponse> => {
  const groupId = req.params.groupId;

  const results = await DBHelper().query<Tables.TQuestions>(Questions.query.byGroupId(groupId));

  return {
    count: results.Items.length,
    questions: results.Items,
  };
};
