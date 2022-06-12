import { Request } from 'express';
import { generate } from 'short-uuid';
import { AbilityService, CurriculumService, GroupService, QuestionService, WordService } from '@services';
import { Commons, DBHelper, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<any, any, APIs.CurriculumRegistRequest, any>
): Promise<APIs.CurriculumRegistResponse | void> => {
  const { groupId, userId } = req.body;
  const guardian = Commons.getUserId(req);

  if (!groupId || !userId) {
    throw new ValidationError('Parameter check error.');
  }

  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new ValidationError('Group informations not found.');
  }

  // 普通グループ
  if (Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    let questions = await QuestionService.listByGroup(groupId);

    // group not exsits or no question in group
    if (questions.length === 0) {
      throw new ValidationError('No questions in group');
    }

    // 英語の場合、
    if (groupInfo.subject === Consts.SUBJECT.ENGLISH) {
      questions = await Promise.all(
        questions.filter(async (item) => {
          return await WordService.isIgnore({
            id: userId,
            word: item.title,
          });
        })
      );
    }

    const dataRows = questions.map<Tables.TLearning>((item) => ({
      qid: item.id,
      userId: userId,
      groupId: item.groupId,
      subject: groupInfo.subject,
      lastTime: Consts.INITIAL_DATE,
      nextTime: Consts.INITIAL_DATE,
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
      order: 9999,
      unlearned: dataRows.length,
    };

    // add new curriculum
    await CurriculumService.regist(response);

    return response;
  }

  // 実力テストグループ
  if (Consts.SUBJECT_ABILITY.includes(groupInfo.subject)) {
    const questions = await AbilityService.listByKey(groupId);

    // group not exsits or no question in group
    if (questions.length === 0) {
      throw new ValidationError('No questions in group');
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
      order: 9999,
      unlearned: questions.length,
    };

    // add new curriculum
    await CurriculumService.regist(response);

    return response;
  }
};
