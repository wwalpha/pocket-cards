import { Request } from 'express';
import { generate } from 'short-uuid';
import { CurriculumService, GroupService, QuestionService, WordService } from '@services';
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
  let questions = await QuestionService.listByGroup(groupId);

  // group not exsits or no question in group
  if (questions.length === 0) {
    throw new ValidationError('No questions in group');
  }

  // 英語の場合
  if (groupInfo.subject === Consts.SUBJECT.ENGLISH) {
    questions = await getQuestionsForEnglish(guardian, userId, questions);
  }

  const dataRows = questions.map<Tables.TLearning>((item) => ({
    qid: item.id,
    userId: userId,
    groupId: item.groupId,
    subject: groupInfo.subject,
    lastTime: Consts.INITIAL_DATE,
    nextTime: Consts.INITIAL_DATE,
    times: Commons.getTimes(groupInfo.subject),
  }));

  // bulk insert
  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);

  const response: Tables.TCurriculums = {
    id: generate(),
    subject: groupInfo.subject,
    guardian: guardian,
    userId: userId,
    groupId: groupId,
    order: 0,
    unlearned: dataRows.length,
  };

  // add new curriculum
  await CurriculumService.regist(response);

  return response;
};

/** 英語の単語一覧 */
const getQuestionsForEnglish = async (guardian: string, userId: string, newQuestions: Tables.TQuestions[]) => {
  // ユーザのカリキュラム一覧
  const curriculums = await CurriculumService.getListByGuardian(guardian, Consts.SUBJECT.ENGLISH, userId);
  // グループ一覧
  const groups = curriculums.map((item) => item.groupId);

  // group questions
  const existQuestions = await Promise.all(
    groups.map(async (item) => await QuestionService.listByGroup(item, 'title'))
  );

  const words = new Set<string>();
  // remove duplicate
  existQuestions.forEach((qg) => qg.forEach((q) => words.add(q.title)));

  const questions = await Promise.all(
    newQuestions.filter(async (item) => {
      return await WordService.isIgnore({
        id: userId,
        word: item.title,
      });
    })
  );

  // remvoe registed
  return questions.filter((item) => words.has(item.title) === false);
};
