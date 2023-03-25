import { Request } from 'express';
import { Logger, DateUtils, Commons, QueryUtils, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { CurriculumService, GroupService, LearningService } from '@services';
import orderBy from 'lodash/orderBy';

/** 自己試験問題取得 */
export default async (req: Request<any, any, APIs.DailyExamRequest, any>): Promise<APIs.DailyExamResponse> => {
  let userId = Commons.getUserId(req);
  const guardianId = Commons.getGuardian(req);
  const { subject, userId: username } = req.body;

  // 科目選択されていない
  if (!subject) {
    throw new Error('Please select subject.');
  }

  // 保護者からのリクエスト
  if (guardianId === userId) {
    if (!username) {
      throw new ValidationError('Required username.');
    }

    userId = username;
  }

  // next study date
  const date = DateUtils.getNow();

  let results: Tables.TLearning[] = [];

  // 漢字の場合
  if (subject === Consts.SUBJECT.HANDWRITING) {
    // 過去問全て
    results = await LearningService.dailyPastsWithoutToday(userId, date, subject);
  } else {
    // 漢字以外の場合
    results = await getLearnings(guardianId, userId, subject);
  }

  // 検索結果０件の場合
  if (results.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${results.length}`);

  // 時間順で上位N件を対象とします
  const targets = results.slice(0, Environment.WORDS_LIMIT);

  // 単語明細情報の取得
  const details = await QueryUtils.getQuestionDetails(targets);

  return {
    count: details.length,
    questions: details,
  };
};

const EmptyResponse = (): APIs.DailyExamResponse => ({
  count: 0,
  questions: [],
});

/**
 * カリキュラム順の学習進捗一覧
 *
 * @param guardianId
 * @param userId
 * @param subject
 * @returns
 */
const getLearnings = async (guardianId: string, userId: string, subject: string): Promise<Tables.TLearning[]> => {
  const [curriculums, priorities, groups] = await Promise.all([
    // ユーザのカリキュラム一覧を取得する
    CurriculumService.getListByGuardian(guardianId, subject, userId),
    // 優先度ありの問題
    LearningService.dailyPriority(userId, subject),
    // 六年生のグループ一覧
    GroupService.listGroupByGrade(subject, Consts.GRADE.GRADE_6),
  ]);

  // グループID一覧
  const groupIds = groups.map((item) => item.id);
  // 質問一覧
  const priLearnings = priorities.filter((item) => groupIds.includes(item.groupId));

  // 優先問題は先に登録
  if (priLearnings.length > Environment.WORDS_LIMIT) {
    return priLearnings;
  }

  const grade6 = [...groupIds];
  let results: Tables.TLearning[] = [...priLearnings];

  for (; grade6.length > 0; ) {
    // 最初の5件を取得する
    const items = grade6.splice(0, 5);
    // グループ毎のテスト問題を取得する
    const tasks = items.map((item) => LearningService.dailyNearTestByGroup(item, userId, subject));
    // 一括実行
    const learnings = await Promise.all(tasks);

    // 結果マージ
    learnings.forEach((item) => {
      results = [...results, ...item];
    });

    // 上限件数超えた場合、即終了
    if (results.length >= Environment.WORDS_LIMIT) {
      return results;
    }
  }

  // 学習順でソートする
  const dataRows = orderBy(curriculums, 'order');
  // next study date
  const date = DateUtils.getNow();

  for (; dataRows.length > 0; ) {
    // 最初の5件を取得する
    const items = dataRows.splice(0, 5);
    // グループ毎のテスト問題を取得する
    const tasks = items.map((item) => LearningService.dailyTestByGroup(item.groupId, userId, date, subject));
    // 一括実行
    const learnings = await Promise.all(tasks);

    // 結果マージ
    learnings.forEach((item) => {
      results = [...results, ...item];
    });

    // 上限件数超えた場合、即終了
    if (results.length >= Environment.WORDS_LIMIT) {
      break;
    }
  }

  return results;
};
