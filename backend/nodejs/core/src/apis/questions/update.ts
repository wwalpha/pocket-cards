import { Request } from 'express';
import { Commons } from '@utils';
import { APIs, Tables } from 'typings';
import { QuestionService } from '@services';

/** 問題カード一括追加 */
export default async (
  req: Request<APIs.QuestionUpdateParams, any, APIs.QuestionUpdateRequest, any>
): Promise<APIs.QuestionUpdateResponse> => {
  const { title, answer, choices } = req.body;
  const { questionId } = req.params;

  // ユーザのグループID 一覧
  const questionInfo = await QuestionService.describe(questionId);

  // question not found
  if (!questionInfo) {
    throw new Error(`Question is not exist. ${questionId}`);
  }

  const item: Tables.TQuestions = {
    ...questionInfo,
    title,
    answer,
    choices: choices?.split('|'),
  };

  // 音声、画像情報を更新する
  await Commons.updateQuestion([item]);

  return item;
};
