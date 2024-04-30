import { Request } from 'express';
import { APIs, Tables } from 'typings';
import { CurriculumService, LearningService, QuestionService } from '@services';
import { ValidationError } from '@utils';
import pLimit from 'p-limit';

export default async (
  req: Request<void, any, APIs.CurriculumStatusRequest, any>
): Promise<APIs.CurriculumStatusResponse> => {
  const { curriculums, startDate = '19900101', endDate = '20991231', unlearned } = req.body;

  // validation
  if (!curriculums || curriculums.length === 0) {
    throw new ValidationError('Curriculum was not found.');
  }

  const limit = pLimit(10);

  const tasks = curriculums.map<Promise<Tables.TLearning[]>>(async (curriculumId) => {
    const cInfo = await CurriculumService.describe(curriculumId);

    // curriculum not found
    if (!cInfo) return [];

    // 問題一覧、開始終了期間内
    const learnings = (
      await LearningService.listByGroupWithProjection(cInfo.groupId, 'qid, times, nextTime', cInfo.userId)
    ).filter((item) => {
      // 開始日付より前
      if (startDate > item.nextTime) return false;
      // 終了日付より後
      if (item.nextTime > endDate) return false;
      // 未学習含まない、且つ学習回数が1より小さい
      if (unlearned !== '1' && item.times < 1) {
        return false;
      }

      return true;
    });

    // 対象問題存在しない
    if (learnings.length === 0) return [];

    // 問題の詳細情報を検索する
    const questions = await Promise.all(
      learnings.map((item) =>
        limit(async () => {
          const [question] = await Promise.all([
            QuestionService.describe(item.qid),
          ]);

          return question;
        })
      )
    );

    return learnings.map<APIs.CurriculumStatusResponseItem>((item) => {
      const question = questions.find((q) => q?.id === item.qid);

      return {
        ...item,
        question: question?.title,
        gid: cInfo.groupId,
      };
    });
  });

  // カリキュラム一括実行
  const results = await Promise.all(tasks);
  const items = results.reduce((prev, curr) => {
    return curr.concat(prev);
  }, []);

  return {
    count: items.length,
    items: items,
  };
};
