import { Request } from 'express';
import { generate } from 'short-uuid';
import { Commons, DBHelper, ValidationError } from '@utils';
import { APIs, Tables } from 'typings';
import { Consts, Environment } from '@consts';
import { AbilityService, CurriculumService, GroupService, QuestionService } from '@services';

export default async (
  req: Request<any, any, APIs.CurriculumRegistRequest, any>
): Promise<APIs.CurriculumRegistResponse | undefined> => {
  const { groupId, userId } = req.body;
  const guardian = Commons.getUserId(req);

  if (!groupId || !userId) {
    throw new ValidationError('Parameter check error.');
  }

  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new Error('Group informations not found.');
  }

  let response: Tables.TCurriculums | undefined;

  // 普通グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    const questions = await QuestionService.listByGroup(groupId);

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

    const response: Tables.TCurriculums = {
      id: generate(),
      subject: groupInfo.subject,
      guardian: guardian,
      userId: userId,
      groupId: groupId,
    };

    // add new curriculum
    await CurriculumService.regist(response);
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(groupInfo.subject)) {
    const questions = await AbilityService.listByKey(groupId);

    // group not exsits or no question in group
    if (questions.length === 0) {
      throw new Error('No questions in group');
    }

    // reset question times
    questions.forEach((item) => {
      item.times = -1;
    });

    // bulk update
    await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, questions);

    const response: Tables.TCurriculums = {
      id: generate(),
      subject: groupInfo.subject,
      guardian: guardian,
      userId: questions[0]!.userId,
      groupId: groupId,
    };

    // add new curriculum
    await CurriculumService.regist(response);
  }

  return response;
};
