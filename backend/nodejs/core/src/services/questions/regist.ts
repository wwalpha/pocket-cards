import { Request } from 'express';
import { generate } from 'short-uuid';
import isEmpty from 'lodash/isEmpty';
import { Commons, DBHelper } from '@utils';
import { Groups, Questions } from '@queries';
import { APIs, Tables } from 'typings';

/** 問題カード一括追加 */
export default async (req: Request<APIs.QuestionRegistParams, any, APIs.QuestionRegistRequest, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;

  // ユーザのグループID 一覧
  const groupInfo = await DBHelper().get<Tables.TGroups>(
    Groups.get({
      id: groupId,
    })
  );

  // group not users
  if (!groupInfo?.Item) {
    throw new Error(`Group id is not exist. ${groupId}`);
  }

  // regist
  const tasks = input.questions.map(async (item) => {
    const items = item.split(',');
    const id = generate();
    const title = items[0] as string;
    const answer = items[3] as string;
    const choices = items[2] as string;

    const qItem: Tables.TQuestions = {
      id: id,
      groupId: groupId,
      title: title,
      description: !isEmpty(items[1]) ? item[1] : undefined,
      choices: !isEmpty(items[2]) ? choices.split('|') : undefined,
      answer: answer,
    };

    // 登録成功
    await DBHelper().transactWrite({
      TransactItems: [{ Put: Questions.put(qItem) }],
    });

    // create image file if needed
    await createImages(id, title, answer);
    // create voice of text
    await createVoices(id, title, answer);
  });

  // regist all questions
  await Promise.all(tasks);

  // update question count
  await DBHelper().put(
    Groups.put({
      ...groupInfo.Item,
      count: input.questions.length,
    })
  );
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
