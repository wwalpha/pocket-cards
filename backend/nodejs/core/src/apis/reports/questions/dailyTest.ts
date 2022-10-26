import { Request } from 'express';
import { DateUtils, Commons, ValidationError } from '@utils';
import { APIs, Tables } from 'typings';
import { CurriculumService, LearningService } from '@services';
import { orderBy } from 'lodash';

export default async (
  req: Request<any, any, APIs.DailyTestQuestionsRequest, any>
): Promise<APIs.DailyTestQuestionsResponse> => {
  const guardianId = Commons.getGuardian(req);
  const { uid, subject } = req.body;

  // validation
  if (!uid) {
    throw new ValidationError('Uid is required.');
  }

  // subject
  if (!subject) {
    throw new ValidationError('Subject is required.');
  }

  const learnings = await getLearnings(guardianId, uid, subject);

  return {
    qid: learnings.map((item) => item.qid),
  };
};

/**
 * カリキュラム順の学習進捗一覧
 *
 * @param guardianId
 * @param uid
 * @param subject
 * @returns
 */
const getLearnings = async (guardianId: string, uid: string, subject: string): Promise<Tables.TLearning[]> => {
  // ユーザのカリキュラム一覧を取得する
  const curriculums = await CurriculumService.getListByGuardian(guardianId, subject, uid);
  // 学習順でソートする
  const dataRows = orderBy(curriculums, 'order');

  // next study date
  const date = DateUtils.getNow();

  const qidArray = await Promise.all(
    dataRows.map((item) => LearningService.dailyTestByGroup(item.groupId, uid, date, subject))
  );

  return qidArray.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.TLearning[]);
};
