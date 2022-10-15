import { Request } from 'express';
import { defaultTo } from 'lodash';
import { Commons, DateUtils, DBHelper, ValidationError } from '@utils';
import { Traces } from '@queries';
import { APIs } from 'typings';
import { LearningService, CurriculumService } from '@services';
import { Consts } from '@consts';

export default async (
  req: Request<APIs.QuestionAnswerParams, any, APIs.QuestionAnswerRequest, any>
): Promise<APIs.QuestionAnswerResponse> => {
  const input = req.body;
  const userId = Commons.getUserId(req);
  const { questionId } = req.params;

  const learning = await LearningService.describe(questionId, userId);

  if (!learning) {
    throw new ValidationError(`Question not found. ${questionId}`);
  }

  // 学習回数が0以外、且つ、当日すでに更新済みの場合、無視する
  if (learning.lastTime === DateUtils.getNow() && learning.times !== 0) {
    return;
  }

  // 正解の場合
  const times = input.correct === '1' ? defaultTo(learning.times, 0) + 1 : 0;
  const nextTime = input.correct === '1' ? DateUtils.getNextTime(times, learning.subject) : DateUtils.getNextTime(0);

  // 学習情報更新
  await LearningService.update({
    ...learning,
    times: times,
    nextTime: nextTime,
    lastTime: DateUtils.getNow(),
  });

  // 初めて勉強の場合
  if (learning.lastTime === Consts.INITIAL_DATE) {
    const curriculums = await CurriculumService.listByGroup(learning.groupId);
    const target = curriculums.find((item) => item.userId === learning.userId);

    if (target) {
      // 未学習数 - 1
      await CurriculumService.updateUnlearned(target.id, -1);
    }
  }

  // 登録実行
  await DBHelper().transactWrite({
    TransactItems: [
      {
        // 履歴登録
        Put: Traces.put({
          qid: learning.qid,
          timestamp: DateUtils.getTimestamp(),
          groupId: learning.groupId,
          userId: learning.userId,
          subject: learning.subject,
          timesBefore: learning.times,
          timesAfter: times,
          lastTime: learning.lastTime,
        }),
      },
    ],
  });
};
