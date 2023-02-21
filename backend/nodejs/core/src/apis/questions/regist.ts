import { Request } from 'express';
import { generate } from 'short-uuid';
import isEmpty from 'lodash/isEmpty';
import { CurriculumService, GroupService, QuestionService, WordService } from '@services';
import { Commons, DBHelper, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';

/** 問題カード一括追加 */
export default async (
  req: Request<APIs.QuestionRegistParams, any, APIs.QuestionRegistRequest, any>
): Promise<APIs.QuestionRegistResponse> => {
  const { questions } = req.body;
  const groupId = req.params.groupId;

  // ユーザのグループID 一覧
  const groupInfo = await GroupService.describe(groupId);

  // group not users
  if (!groupInfo) {
    throw new ValidationError(`Group id is not exist. ${groupId}`);
  }

  let qItems: Tables.TQuestions[] = [];
  if (groupInfo.subject === Consts.SUBJECT.ENGLISH) {
    qItems = await registEnglish(groupInfo, questions);
  } else {
    qItems = await registDefault(groupInfo, questions);
  }

  const curriculumInfos = await CurriculumService.listByGroup(groupId);

  // 学習対象がない
  if (curriculumInfos.length === 0) {
    return {
      count: qItems.length,
      ids: qItems.map((item) => item.id),
    };
  }

  // 未学習件数を更新する
  await Promise.all(curriculumInfos.map(async (item) => CurriculumService.updateUnlearned(item.id, qItems.length)));

  const lTasks = curriculumInfos.map(async (item) => {
    const dataRows = qItems.map<Tables.TLearning>((q) => ({
      qid: q.id,
      userId: item.userId,
      groupId: item.groupId,
      subject: groupInfo.subject,
      lastTime: Consts.INITIAL_DATE,
      nextTime: Consts.INITIAL_DATE,
      times: -1,
    }));

    return DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);
  });

  // 学習計画に登録
  await Promise.all(lTasks);

  return {
    count: qItems.length,
    ids: qItems.map((item) => item.id),
  };
};

const registDefault = async (groupInfo: Tables.TGroups, questions: string[]) => {
  // create question
  const qItems = questions.map<Tables.TQuestions>((item) => {
    const items = item.split(',');
    const id = generate();
    const title = items[0] as string;
    const answer = items[3] as string;
    const choices = items[2] as string;

    return {
      id: id,
      subject: groupInfo.subject,
      groupId: groupInfo.id,
      title: title,
      description: !isEmpty(items[1]) ? item[1] : undefined,
      choices: !isEmpty(items[2]) ? choices.split('|') : undefined,
      answer: answer,
    };
  });

  // regist all questions
  await Promise.all([
    qItems.map((item) => QuestionService.regist(item)),
    GroupService.plusCount(groupInfo.id, qItems.length),
  ]);

  // 質問の情報を更新する(非同期)
  await Commons.updateQuestion(qItems);

  return qItems;
};

/** 英語単語一括登録 */
const registEnglish = async (groupInfo: Tables.TGroups, questions: string[]) => {
  // create question
  const dataRows = questions
    .map((item) => {
      const items = item.split(',');
      return items[0] ?? '';
    })
    .filter((item) => item !== '');

  // 単語の語彙を取得する
  let tasks = dataRows.map(async (item) => {
    const ignore = await WordService.isIgnore({
      id: Consts.Authority.ADMIN,
      word: item,
    });

    // 無視単語を除外する
    if (ignore === true) {
      return undefined;
    }

    return await WordService.describe(item);
  });

  // 無視単語を１次フィルター
  const filter1 = await Promise.all(tasks);

  const words = filter1
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map((item) => item.original);

  // 重複削除する
  const targets = Array.from(new Set(words));

  tasks = targets.map(async (item) => {
    const w = filter1.find((wi) => wi?.id === item);

    if (w) return w;

    return await WordService.describe(item);
  });

  // 重複単語を修正する
  const filter2 = await Promise.all(tasks);

  // 登録単語作成
  const qItems = filter2
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map<Tables.TQuestions>((item) => ({
      id: generate(),
      subject: groupInfo.subject,
      groupId: groupInfo.id,
      title: item.original,
      answer: `${item.vocChn}|${item.vocJpn}`,
      description: item.pronounce,
      voiceTitle: item.mp3,
    }));

  // regist all questions
  await Promise.all([
    qItems.map(async (item) => QuestionService.regist(item)),
    GroupService.plusCount(groupInfo.id, qItems.length),
  ]);

  return qItems;
};
