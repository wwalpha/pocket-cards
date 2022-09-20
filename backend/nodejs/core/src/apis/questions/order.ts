import { Request } from 'express';
import { APIs, Tables } from 'typings';
import { Commons, DateUtils, ValidationError } from '@utils';
import { CurriculumService, LearningService, QuestionService } from '@services';
import orderBy from 'lodash/orderBy';
import { Environment } from '@consts';

export default async (req: Request<any, any, APIs.QuestionOrderRequest, any>): Promise<APIs.QuestionOrderResponse> => {
  let userId = Commons.getUserId(req);
  const guardianId = Commons.getGuardian(req);
  const { subject, userId: username } = req.body;

  // 科目選択されていない
  if (!subject) {
    throw new ValidationError('Please select subject.');
  }

  // 保護者からのリクエスト
  if (guardianId === userId) {
    if (!username) {
      throw new ValidationError('Required username.');
    }

    userId = username;
  }

  // const userInfo = await UserService.getUserInfo(userId, req.headers);
  // const guardianId = userInfo.teacher;

  // // 保護者の必須チェック
  // if (!guardianId) {
  //   throw new ValidationError('Guardian is not found.');
  // }

  // ユーザのカリキュラム一覧を取得する
  const curriculums = await CurriculumService.getListByGuardian(guardianId, subject, userId);
  // 学習順でソートする
  const dataRows = orderBy(curriculums, 'order');

  const dailyTasks = await LearningService.dailyPastTasks(userId, DateUtils.getNow(), subject);
  let learnings: Tables.TLearning[] = [];

  while (learnings.length < Environment.WORDS_LIMIT && dataRows.length > 0) {
    // 最初からカリキュラム情報を取得する
    const curriculum = dataRows.shift();
    // 同一Groupの学習情報をフィルターする
    const results = dailyTasks.filter((item) => item.groupId === curriculum?.groupId);

    learnings = [...learnings, ...results];
  }

  // 上限数まで減少
  learnings = learnings.slice(0, Environment.WORDS_LIMIT);

  // 問題情報を取得する
  const questions = await Promise.all(learnings.map((item) => QuestionService.describe(item.qid)));

  return {
    count: questions.length,
    questions: questions.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  };
};
