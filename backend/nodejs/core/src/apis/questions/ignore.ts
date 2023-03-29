import { Request } from 'express';
import { Consts } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, GroupService, LearningService, QuestionService, WordMasterService } from '@services';
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

  const tasks = [
    // グループの問題数を調整する
    GroupService.minusCount(groupId, 1),
    // 問題を削除する
    QuestionService.remove(question.id),

    // 単語無視に登録する
    WordMasterService.registIgnore({
      id: Consts.Authority.ADMIN,
      word: question.title,
    }),
  ];

  // 学習進捗ある場合
  if (learning) {
    // 学習状況を削除する
    tasks.push(LearningService.remove(qid, userId));

    // 未学習の場合
    if (learning.lastTime === Consts.INITIAL_DATE && curriculum) {
      tasks.push(CurriculumService.updateUnlearned(curriculum.id, -1));
    }
  }

  // 単語削除、無視単語の追加
  await Promise.all(tasks);
};
