import { Request } from 'express';
import { generate } from 'short-uuid';
import isEmpty from 'lodash/isEmpty';
import { Commons, DBHelper } from '@utils';
import { Curriculums, Groups, Questions } from '@queries';
import { APIs, Tables } from 'typings';
import { Environment } from '@consts';

/** 問題カード一括追加 */
export default async (req: Request<APIs.QuestionRegistParams, any, APIs.QuestionRegistRequest, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;

  // ユーザのグループID 一覧
  const result = await DBHelper().get<Tables.TGroups>(
    Groups.get({
      id: groupId,
    })
  );

  const groupInfo = result?.Item;
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
  const tasks = questions.map(async (item) => {
    // 登録成功
    await DBHelper().transactWrite({
      TransactItems: [{ Put: Questions.put(item) }],
    });

    // create image file if needed
    await createImages(item.id, item.title, item.answer);
    // create voice of text
    await createVoices(item.id, item.title, item.answer);
  });

  // regist all questions
  await Promise.all(tasks);

  // update question count
  await DBHelper().update(Groups.update.addCount({ id: groupId }, questions.length));

  const curriculumInfos = await DBHelper().query<Tables.TCurriculums>(Curriculums.query.byGroupId(groupId));

  // 学習対象がない
  if (curriculumInfos.Items.length === 0) {
    return;
  }

  const lTasks = curriculumInfos.Items.map(async (item) => {
    const dataRows = questions.map<Tables.TLearning>((q) => ({
      qid: q.id,
      userId: item.guardian,
      groupId: item.groupId,
      subject: result.Item?.subject,
      lastTime: '19900101',
      nextTime: '19900101',
      times: 0,
    }));

    return DBHelper().bulk(Environment.TABLE_NAME_LEARNING, dataRows);
  });

  await Promise.all(lTasks);
};

const createImages = async (qid: string, title: string, answer: string): Promise<void> => {
  const newTitle = await getS3Key(title);
  const newAnswer = await getS3Key(answer);

  // not changed
  if (newTitle === title && newAnswer === answer) {
    return;
  }

  const results = await DBHelper().get<Tables.TQuestions>(Questions.get({ id: qid }));
  const item = results?.Item;

  if (!item) return;

  // update url
  await DBHelper().put(
    Questions.put({
      ...item,
      title: newTitle,
      answer: newAnswer,
    })
  );
};

const getS3Key = async (text: string): Promise<string> => {
  if (!text.match(/\[http(s?):\/\/.*\]$/)) {
    return text;
  }

  const startIdx = text.indexOf('[http');
  const endIdx = text.indexOf(']');
  const url = text.substring(startIdx + 1, endIdx);

  const s3Key = await Commons.generateImage(url);

  return text.replace(/\[http(s?):\/\/.*\]$/, `[${s3Key}]`);
};

const createVoices = async (qid: string, title: string, answer: string): Promise<void> => {
  const newTitle = title.replace(/\[http(s?):\/\/.*\]$/, '');
  const newAnswer = answer.replace(/\[http(s?):\/\/.*\]$/, '');
  const titleKey = await Commons.createJapaneseVoice(newTitle);
  const answerKey = await Commons.createJapaneseVoice(newAnswer);

  const results = await DBHelper().get<Tables.TQuestions>(Questions.get({ id: qid }));
  const item = results?.Item;

  if (!item) return;

  // update url
  await DBHelper().put(
    Questions.put({
      ...item,
      voiceTitle: titleKey,
      voiceAnswer: answerKey,
    })
  );
};
