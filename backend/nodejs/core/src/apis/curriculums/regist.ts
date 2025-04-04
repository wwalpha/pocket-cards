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
  const curriculumId = generate();

  // group not exsits or no question in group
  // if (questions.length === 0) {
  //   throw new ValidationError('No questions in group');
  // }

  // 英語の場合
  if (groupInfo.subject === Consts.SUBJECT.ENGLISH) {
    questions = await registEnglish(userId, curriculumId, questions);
  } else {
    await registOthers(userId, questions);
  }

  const response: Tables.TCurriculums = {
    id: curriculumId,
    subject: groupInfo.subject,
    guardian: guardian,
    userId: userId,
    groupId: groupId,
    order: 0,
    unlearned: questions.length,
  };

  // add new curriculum
  await CurriculumService.regist(response);

  return response;
};

const registOthers = async (userId: string, questions: Tables.TQuestions[]) => {
  await registLearning(userId, questions);
};

const registEnglish = async (
  userId: string,
  curriculumId: string,
  questions: Tables.TQuestions[]
): Promise<Tables.TQuestions[]> => {
  const limit = pLimit(100);

  // 無視の単語を除外する
  const filteredIgnores = await Promise.all(
    questions.map((item) =>
      limit(async () => {
        const ignoreUser = await WordMasterService.isIgnore({
          id: userId,
          word: item.title,
        });

        const ignoreAdmin = await WordMasterService.isIgnore({
          id: Consts.Authority.ADMIN,
          word: item.title,
        });

        return {
          question: item,
          ignore: ignoreUser === true || ignoreAdmin === true,
        };
      })
    )
  );

  const newQuestions = filteredIgnores.filter((item) => !item.ignore).map((item) => ({ ...item.question }));

  // すでに学習中の単語は除外する
  const learningStatus = await Promise.all(
    newQuestions.map((item) =>
      limit(async () => {
        const word = await UserWordService.describe({
          id: item.title,
          uid: userId,
        });

        return {
          question: item,
          exist: word !== undefined,
        };
      })
    )
  );

  const unregistedQuestions = learningStatus.filter((item) => !item.exist).map((item) => ({ ...item.question }));

  // 学習単語の登録
  registLearning(userId, unregistedQuestions);

  const tasks = unregistedQuestions.map((item) =>
    limit(async () => {
      await UserWordService.regist({
        id: item.title,
        uid: userId,
        curriculumns: [curriculumId],
      });
    })
  );

  await Promise.all(tasks);

  return unregistedQuestions;
};

const registLearning = async (userId: string, questions: Tables.TQuestions[]) => {
  // 学習問題の準備
  const dataRows = questions.map<Tables.TLearning>((item) => ({
    qid: item.id,
    userId: userId,
    groupId: item.groupId,
    subject: item.subject,
    lastTime: Consts.INITIAL_DATE,
    nextTime: Consts.INITIAL_DATE,
    times: Commons.getRegistTimes(),
  }));

  // 学習問題の一括登録
  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);
};
