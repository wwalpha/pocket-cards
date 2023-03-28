import { Request } from 'express';
import { generate } from 'short-uuid';
import { CurriculumService, GroupService, QuestionService, UserWordService, WordMasterService } from '@services';
import { Commons, DBHelper, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import pLimit from 'p-limit';

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
    questions = await getQuestionsForEnglish(userId, questions);
  }

  const dataRows = questions.map<Tables.TLearning>((item) => ({
    qid: item.id,
    userId: userId,
    groupId: item.groupId,
    subject: groupInfo.subject,
    lastTime: Consts.INITIAL_DATE,
    nextTime: Consts.INITIAL_DATE,
    times: Commons.getRegistTimes(groupInfo.subject),
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
const getQuestionsForEnglish = async (userId: string, newQuestions: Tables.TQuestions[]) => {
  const limit = pLimit(100);

  // search duplicate
  const tasks = newQuestions.map((item) =>
    limit(async () => {
      const word = await UserWordService.describe({
        uid: userId,
        word: item.title,
      });

      return word === undefined ? item : undefined;
    })
  );

  const results = await Promise.all(tasks);

  // remove duplicate
  const questions = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // check ignore
  const registQuestions = await Promise.all(
    questions.filter((item) =>
      limit(async () => {
        const ignore = await WordMasterService.isIgnore({
          id: userId,
          word: item.title,
        });

        return !ignore;
      })
    )
  );

  const userWords = registQuestions.map<Tables.TUserWords>((item) => ({
    uid: userId,
    word: item.title,
  }));

  if (userWords.length > 0) {
    await DBHelper().bulk(Environment.TABLE_NAME_USER_WORDS, userWords);
  }

  return registQuestions;
};
