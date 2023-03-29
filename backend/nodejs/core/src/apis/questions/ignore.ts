import { Request } from 'express';
import { Consts } from '@consts';
import { APIs } from 'typings';
import {
  CurriculumService,
  GroupService,
  LearningService,
  QuestionService,
  UserWordService,
  WordMasterService,
} from '@services';
import { ValidationError } from '@utils';

/** 今日のテスト */
export default async (
  req: Request<APIs.QuestionIgnoreParams, any, APIs.QuestionIgnoreRequest, any>
): Promise<APIs.QuestionIgnoreResponse> => {
  const { groupId } = req.params;
  const { qid } = req.body;

  // get all informations
  const results = await Promise.all([
    GroupService.describe(groupId),
    QuestionService.describe(qid),
    LearningService.listByQuestion(qid, 'qid, userId, lastTime'),
    CurriculumService.listByGroup(groupId),
  ]);

  const [groupInfo, question, learnings, curriculumns] = results;

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

  learnings.forEach((item) => {
    // 学習進捗削除
    tasks.push(LearningService.remove(item.qid, item.userId));

    // 未学習の場合
    const curriculum = curriculumns.find((c) => c.userId === item.userId);

    if (item.lastTime === Consts.INITIAL_DATE && curriculum) {
      tasks.push(CurriculumService.updateUnlearned(curriculum.id, -1));
    }

    // 学習単語リストから削除する
    tasks.push(
      UserWordService.remove({
        id: question.title,
        uid: item.userId,
      })
    );
  });

  // 単語削除、無視単語の追加
  await Promise.all(tasks);
};
