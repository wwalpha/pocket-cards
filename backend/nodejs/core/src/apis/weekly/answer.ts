import { Request } from 'express';
import { Consts } from '@consts';
import { CurriculumService, LearningService, TraceService } from '@services';
import { APIs, Tables } from 'typings';
import { Commons, DateUtils, ValidationError } from '@utils';
import { defaultTo } from 'lodash';

/** 週テスト対策の回答 */
export default async (
  req: Request<APIs.WeeklyAnswerParameter, any, APIs.WeeklyAnswerRequest, any>
): Promise<APIs.WeeklyAnswerResponse> => {
  const { questionId: qid } = req.params;
  const { correct } = req.body;
  const userId = Commons.getUserId(req);

  const learning = await LearningService.describe(qid, userId);

  if (!learning) {
    throw new ValidationError(`Question not found. ${qid}`);
  }

  // 正解の場合
  const times = correct === '1' ? defaultTo(learning.times, 0) + 1 : -1;
  const nextTime = correct === '1' ? DateUtils.getNextTime(times, learning.subject) : DateUtils.getNextTime(-1);

  // 学習情報更新
  await LearningService.update({
    ...learning,
    times: times,
    nextTime: nextTime,
    lastTime: DateUtils.getNow(),
  });

  // ステータス削除
  await LearningService.removeAttribute(
    {
      qid: learning.qid,
      userId: learning.userId,
    },
    'REMOVE subject_weekly'
  );

  // 初めて勉強の場合
  if (learning.lastTime === Consts.INITIAL_DATE) {
    const curriculums = await CurriculumService.listByGroup(learning.groupId);
    const target = curriculums.find((item) => item.userId === learning.userId);

    if (target) {
      // 未学習数 - 1
      await CurriculumService.updateUnlearned(target.id, -1);
    }
  }

  // 履歴登録
  await TraceService.regist({
    qid: learning.qid,
    groupId: learning.groupId,
    userId: learning.userId,
    subject: learning.subject,
    timesBefore: learning.times,
    timesAfter: times,
    lastTime: learning.lastTime,
  });

  const traceItem: Tables.TTraces = {
    qid: learning.qid,
    timestamp: DateUtils.getTimestamp(),
    groupId: learning.groupId,
    userId: learning.userId,
    subject: learning.subject,
    timesBefore: learning.times,
    timesAfter: times,
    lastTime: learning.lastTime,
  };

  // 履歴登録
  await TraceService.registStream(traceItem);
  await TraceService.regist(traceItem);
};
