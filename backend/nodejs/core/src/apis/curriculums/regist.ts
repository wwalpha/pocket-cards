import { Request } from 'express';
import { generate } from 'short-uuid';
import { Commons, DBHelper } from '@utils';
import { APIs, Tables } from 'typings';
import { Environment } from '@consts';
import { CurriculumService, GroupService, QuestionService } from '@services';

export default async (
  req: Request<any, any, APIs.CurriculumRegistRequest, any>
): Promise<APIs.CurriculumRegistResponse> => {
  const { groupId, userId } = req.body;
  const guardian = Commons.getUserId(req);

  if (!groupId || !userId) {
    throw new Error('Parameter check error.');
  }

  // get group info
  // get all questions in group
  const results = await Promise.all([GroupService.describe(groupId), QuestionService.listQuestionsByGroup(groupId)]);

  // group info
  const groupInfo = results[0];
  // all questions in group
  const questions = results[1];

  // group not exsits or no question in group
  if (!groupInfo) {
    throw new Error('Group informations not found.');
  }

  // group not exsits or no question in group
  if (questions.length === 0) {
    throw new Error('No questions in group');
  }

  const dataRows = questions.map<Tables.TLearning>((item) => ({
    qid: item.id,
    userId: userId,
    groupId: item.groupId,
    subject: groupInfo.subject,
    lastTime: '19900101',
    nextTime: '19900101',
    times: 0,
  }));

  // bulk insert
  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);

  const item: Tables.TCurriculums = {
    id: generate(),
    subject: groupInfo.subject,
    guardian: guardian,
    userId: userId,
    groupId: groupId,
  };

  // add new curriculum
  await CurriculumService.create(item);

  return item;
};
