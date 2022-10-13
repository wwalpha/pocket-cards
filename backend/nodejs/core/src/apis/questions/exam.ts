import { Request } from 'express';
import { Logger, DateUtils, Commons, QueryUtils, ValidationError } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { CurriculumService, LearningService } from '@services';
import orderBy from 'lodash/orderBy';

/** 今日のテスト */
export default async (
  req: Request<any, any, APIs.QuestionTestRequest, APIs.QuestionTestQuery>
): Promise<APIs.QuestionTestResponse> => {
  let userId = Commons.getUserId(req);
  const guardianId = Commons.getGuardian(req);
  const { subject, userId: username } = req.query;

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

const EmptyResponse = (): APIs.QuestionStudyResponse => ({
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
  // ユーザのカリキュラム一覧を取得する
  const curriculums = await CurriculumService.getListByGuardian(guardianId, subject, userId);
  // 学習順でソートする
  const dataRows = orderBy(curriculums, 'order');

  // next study date
  const date = DateUtils.getNow();
  let results: Tables.TLearning[] = [];

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
