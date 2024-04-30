import { Request } from 'express';
import { Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { QuestionService, WordMasterService } from '@services';
import { Consts } from '@consts';

/** 問題カード一括追加 */
export default async (
  req: Request<APIs.QuestionUpdateParams, any, APIs.QuestionUpdateRequest, any>
): Promise<APIs.QuestionUpdateResponse> => {
  const { title, answer, choices, description, category, difficulty, tags } = req.body;
  const { questionId } = req.params;

  // ユーザのグループID 一覧
  const question = await QuestionService.describe(questionId);

  // question not found
  if (!question) {
    throw new Error(`Question is not exist. ${questionId}`);
  }

  const item: Tables.TQuestions = {
    ...question,
    title,
    answer,
    choices: choices?.split('|'),
    description,
    category,
    difficulty,
    tags,
  };

  // 音声、画像情報を更新する
  await Commons.updateQuestion([item], question.subject !== Consts.SUBJECT.MATHS);

  // 英語の場合、Masterも更新する
  if (question.subject === Consts.SUBJECT.ENGLISH) {
    // 非同期でmaster更新
    updateWordMaster(question.title, answer, description);
  }

  return item;
};

const updateWordMaster = async (id: string, answer: string, description: string | undefined) => {
  const word = await WordMasterService.describe({
    id,
  });

  word.vocChn = answer.split('|')[0];
  word.vocJpn = answer.split('|')[1];
  word.pronounce = description;

  await WordMasterService.update(word);
};
