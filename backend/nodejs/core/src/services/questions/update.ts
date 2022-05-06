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

  // 音声、画像情報を更新する
  await Commons.updateQuestion([item]);

  return item;
};
