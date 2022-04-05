import { Request } from 'express';
import { Questions } from '@queries';
import { DBHelper } from '@utils';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<APIs.QuestionListParams, any, APIs.QuestionListRequest, any>
): Promise<APIs.QuestionListResponse> => {
  const groupId = req.params.groupId;

  const results = await DBHelper().query<Tables.TQuestions>(Questions.query.byGroupId(groupId));

  return {
    count: results.Items.length,
    questions: results.Items,
  };
};
