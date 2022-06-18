import { Request } from 'express';
import { Consts } from '@consts';
import { APIs } from 'typings';
import { GroupService, QuestionService, WordService } from '@services';
import { ValidationError } from '@utils';

/** 今日のテスト */
export default async (
  req: Request<APIs.QuestionIgnoreParams, any, APIs.QuestionIgnoreRequest, any>
): Promise<APIs.QuestionIgnoreResponse> => {
  const { questionId, groupId } = req.params;

  const groupInfo = await GroupService.describe(groupId);

  // 英語以外の場合、無効です
  if (groupInfo?.subject !== Consts.SUBJECT.ENGLISH) {
    throw new ValidationError('Only effect to english subject.');
  }

  const question = await QuestionService.describe(questionId);

  // question not found
  if (!question) {
    throw new ValidationError('Question not found.');
  }

  // 学習詳細取得する
  // const results = await Promise.all([LearningService.listByQuestion(questionId), QuestionService.describe(questionId)]);

  // const learning = results[0];
  // const question = results[1];

  // const tasks = learning.map(async (item) => {
  //   // 未学習の場合、カウントを引く
  //   if (item.lastTime === Consts.INITIAL_DATE) {
  //     // 対象カリキュラムを検索する
  //     const curriculums = await CurriculumService.listByGroup(item.groupId, item.userId);

  //     // 処理実行
  //     await Promise.all(
  //       curriculums.map(async (c) => {
  //         await CurriculumService.updateUnlearned(c.id, -1);
  //       })
  //     );
  //   }

  //   // 学習対象から削除する
  //   await LearningService.remove(item.qid, item.userId);
  // });

  // // 学習実績を削除する
  // await Promise.all(tasks);

  // 単語削除、無視単語の追加
  await Promise.all([
    QuestionService.remove(question.id),
    WordService.registIgnore({
      id: Consts.Authority.ADMIN,
      word: question.title,
    }),
  ]);
};
