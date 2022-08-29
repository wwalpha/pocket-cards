import { Request } from 'express';
import { Consts } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, GroupService, LearningService, QuestionService, WordService } from '@services';
import { Commons, ValidationError } from '@utils';

/** 今日のテスト */
export default async (
  req: Request<APIs.QuestionIgnoreParams, any, APIs.QuestionIgnoreRequest, any>
): Promise<APIs.QuestionIgnoreResponse> => {
  const { groupId } = req.params;
  const { qid } = req.body;
  const userId = Commons.getUserId(req);

  // get all informations
  const results = await Promise.all([
    GroupService.describe(groupId),
    QuestionService.describe(qid),
    LearningService.describe(qid, userId),
    CurriculumService.queryByGroup(groupId, userId),
  ]);

  const [groupInfo, question, learning, curriculum] = results;

  // 英語以外の場合、無効です
  if (groupInfo?.subject !== Consts.SUBJECT.ENGLISH) {
    throw new ValidationError('Only effect to English.');
  }
  // question not found
  if (!question) {
    throw new ValidationError('Question not found.');
  }

  // Curriculum not found
  if (!curriculum) {
    throw new ValidationError('Curriculum not found.');
  }

  const tasks = [
    // グループの問題数を調整する
    GroupService.minusCount(groupId, 1),
    // 問題を削除する
    QuestionService.remove(question.id),
    // 学習状況を削除する
    LearningService.remove(qid, userId),
    // 単語無視に登録する
    WordService.registIgnore({
      id: Consts.Authority.ADMIN,
      word: question.title,
    }),
  ];

  // 未学習の場合
  if (learning?.lastTime === Consts.INITIAL_DATE) {
    tasks.push(CurriculumService.updateUnlearned(curriculum.id, -1));
  }

  // 単語削除、無視単語の追加
  await Promise.all(tasks);
};
