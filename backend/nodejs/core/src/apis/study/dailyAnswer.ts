import { Request } from 'express';
import { defaultTo } from 'lodash';
import { Consts } from '@consts';
import { Commons, DateUtils, ValidationError } from '@utils';
import { LearningService, CurriculumService, TraceService } from '@services';
import { APIs, Tables } from 'typings';

const SUBJECTS = [Consts.SUBJECT.LANGUAGE, Consts.SUBJECT.ENGLISH];

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

  // 正解の場合
  let times = 0;
  const subject = learning.subject ?? '';

  // 国語の場合、復習が必要ない
  if (SUBJECTS.includes(subject)) {
    times = correct === '1' ? defaultTo(learning.times, 0) + 1 : 0;
  } else {
    times = correct === '1' ? defaultTo(learning.times, 0) + 1 : -1;
  }

  const nextTime = correct === '1' ? DateUtils.getNextTime(times, learning.subject) : DateUtils.getNextTime(-1);

  // 学習情報更新
  await LearningService.update({
    ...learning,
    times: times,
    nextTime: nextTime,
    lastTime: DateUtils.getNow(),
    priority: undefined,
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
const validate = (
  request: Request<any, any, APIs.QuestionAnswerRequest, any>
): Required<APIs.QuestionAnswerRequest> => {
  const { qid, correct } = request.body;

  // validation
  if (!qid || !correct) {
    throw new ValidationError('Bad request.');
  }

  return { qid, correct };
};
