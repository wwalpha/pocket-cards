import { Request } from 'express';
import { generate } from 'short-uuid';
import isEmpty from 'lodash/isEmpty';
import { CurriculumService, GroupService, QuestionService } from '@services';
import { Commons, DBHelper } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';

/** 問題カード一括追加 */
export default async (req: Request<APIs.QuestionRegistParams, any, APIs.QuestionRegistRequest, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;

  // ユーザのグループID 一覧
  const groupInfo = await GroupService.describe(groupId);

  // group not users
  if (!groupInfo) {
    throw new Error(`Group id is not exist. ${groupId}`);
  }

  // create question
  const questions = input.questions.map<Tables.TQuestions>((item) => {
    const items = item.split(',');
    const id = generate();
    const title = items[0] as string;
    const answer = items[3] as string;
    const choices = items[2] as string;

    return {
      id: id,
      subject: groupInfo.subject,
      groupId: groupId,
      title: title,
      description: !isEmpty(items[1]) ? item[1] : undefined,
      choices: !isEmpty(items[2]) ? choices.split('|') : undefined,
      answer: answer,
    };
  });

  // regist question
  const tasks = questions.map(async (item) => QuestionService.regist(item));

  // regist all questions
  await Promise.all(tasks);
  // update question count
  await GroupService.plusCount(groupId, questions.length);

  // 質問の情報を更新する
  Commons.updateQuestion(questions);

  const curriculumInfos = await CurriculumService.getListByGroup(groupId);

  // 学習対象がない
  if (curriculumInfos.length === 0) {
    return;
  }

  const lTasks = curriculumInfos.map(async (item) => {
    const dataRows = questions.map<Tables.TLearning>((q) => ({
      qid: q.id,
      userId: item.guardian,
      groupId: item.groupId,
      subject: groupInfo.subject,
      lastTime: Consts.INITIAL_DATE,
      nextTime: Consts.INITIAL_DATE,
      times: 0,
    }));

    return DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);
  });

  await Promise.all(lTasks);
};
