import { Request } from 'express';
import { Commons, DBHelper } from '@utils';
import { Questions } from '@queries';
import { APIs, Tables } from 'typings';

/** 問題カード一括追加 */
export default async (
  req: Request<APIs.QuestionUpdateParams, any, APIs.QuestionUpdateRequest, any>
): Promise<APIs.QuestionUpdateResponse> => {
  const { title, answer } = req.body;
  const { questionId } = req.params;

  // ユーザのグループID 一覧
  const questionInfo = await DBHelper().get<Tables.TQuestions>(
    Questions.get({
      id: questionId,
    })
  );

  // question not found
  if (!questionInfo?.Item) {
    throw new Error(`Question is not exist. ${questionId}`);
  }

  const item: Tables.TQuestions = {
    ...questionInfo.Item,
    title,
    answer,
  };

  // create image file if needed
  await updateImage(item);
  // create voice of text
  await updateVoice(item);
  // update record
  await DBHelper().put(Questions.put(item));

  return item;
};

const updateImage = async (question: Tables.TQuestions): Promise<void> => {
  const newTitle = await getS3Key(question.title);
  const newAnswer = await getS3Key(question.answer);

  // not changed
  if (newTitle === question.title && newAnswer === question.answer) {
    return;
  }

  // update value
  question.title = newTitle;
  question.answer = newAnswer;
};

const updateVoice = async (question: Tables.TQuestions): Promise<void> => {
  const newTitle = question.title.replace(/\[http(s?):\/\/.*\]$/, '');
  const newAnswer = question.answer.replace(/\[http(s?):\/\/.*\]$/, '');
  const titleKey = await Commons.createJapaneseVoice(newTitle);
  const answerKey = await Commons.createJapaneseVoice(newAnswer);

  // update value
  question.voiceTitle = titleKey;
  question.voiceAnswer = answerKey;
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
