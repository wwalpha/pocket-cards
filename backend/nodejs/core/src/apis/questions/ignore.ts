import { Request } from 'express';
import { Consts } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, LearningService, QuestionService, WordService } from '@services';

/** 今日のテスト */
export default async (
  req: Request<APIs.QuestionIgnoreParams, any, APIs.QuestionIgnoreRequest, any>
): Promise<APIs.QuestionIgnoreResponse> => {
  const { qid } = req.body;

  // 学習詳細取得する
  const results = await Promise.all([LearningService.listByQuestion(qid), QuestionService.describe(qid)]);

  const learning = results[0];
  const question = results[1];

  const tasks = learning.map(async (item) => {
    // 未学習の場合、カウントを引く
    if (item.lastTime === Consts.INITIAL_DATE) {
      // 対象カリキュラムを検索する
      const curriculums = await CurriculumService.listByGroup(item.groupId, item.userId);

      // 処理実行
      await Promise.all(
        curriculums.map(async (c) => {
          await CurriculumService.updateUnlearned(c.id, -1);
        })
      );
    }

    // 学習対象から削除する
    await LearningService.remove(item.qid, item.userId);
  });

  // 学習実績を削除する
  await Promise.all(tasks);

  // 無視単語登録
  await WordService.registIgnore({
    id: Consts.Authority.ADMIN,
    word: question?.title ?? '',
  });
};
