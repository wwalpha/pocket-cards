import { Request } from 'express';
import { defaultTo } from 'lodash';
import { Consts } from '@consts';
import { Commons, DateUtils, ValidationError } from '@utils';
import { LearningService, CurriculumService, TraceService } from '@services';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<any, any, APIs.QuestionAnswerRequest, any>
): Promise<APIs.QuestionAnswerResponse> => {
  // 入力値
  const { qid, correct } = validate(req);
  // ユーザID
  const userId = Commons.getUserId(req);

  // 学習状況取得
  const learning = await LearningService.describe(qid, userId);

  // 学習状況存在しない
  if (!learning) {
    throw new ValidationError(`Question was not found. ${qid}`);
  }

  // 学習回数が0以外、且つ、当日すでに更新済みの場合、無視する
  if (learning.lastTime === DateUtils.getNow() && learning.times > 0) {
    return;
  }

  const { times, nextTime } = getNextTime(learning, correct);

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

// リクエスト検証
const validate = (request: Request<any, any, APIs.QuestionAnswerRequest, any>): APIs.QuestionAnswerRequest => {
  const { qid, correct } = request.body;

  // validation
  if (!qid || !correct) {
    throw new ValidationError('Bad request.');
  }

  return { qid, correct };
};

const isCorrect = (value: string) => {
  return value === '1';
};

const getNextTime = (
  current: Tables.TLearning,
  correct: string
): {
  times: number;
  nextTime: string;
} => {
  const { subject, times } = current;
  const { LANGUAGE } = Consts.SUBJECT;

  // 正解の場合、次回学習時間を計算する
  if (isCorrect(correct) === true) {
    const nextTimes = defaultTo(current.times, 0) + 1;

    return {
      times: nextTimes,
      nextTime: DateUtils.getNextTime(nextTimes, subject),
    };
  }

  // 不正解の場合 且つ国語の場合、次回学習時間を今日にする
  // 国語以外かつ正解回数が6以下の場合、次回学習時間を今日にする
  if (subject === LANGUAGE || (subject !== LANGUAGE && times <= 6)) {
    return {
      times: 0,
      nextTime: DateUtils.getNextTime(0),
    };
  }

  return {
    times,
    nextTime: DateUtils.getNextTime(times, subject),
  };
};
