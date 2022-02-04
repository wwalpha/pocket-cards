import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { DBHelper, Logger, DateUtils, Commons, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { Words, Groups } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日のテスト */
export default async (req: Request): Promise<APIs.D004Response> => {
  // ユーザID
  const userId = Commons.getUserId(req);

  // ユーザのグループ一覧を取得する
  const userInfo = await DBHelper().query<Tables.TGroups>(Groups.query.byUserId(userId));
  const groups = userInfo.Items;

  // グループ存在しない
  if (!groups || groups.length === 0) {
    return EmptyResponse();
  }

  // next test date
  const date = DateUtils.getNow();
  // get test items
  const tasks = groups.map((item) => DBHelper().query<Tables.TWords>(Words.query.test(item.id, date)));
  // execute
  const results = await Promise.all(tasks);

  // results -> array
  const words = results
    .map((item) => item.Items)
    .reduce((prev, curr) => {
      return curr.concat(prev);
    }, [] as Tables.TWords[]);

  // 検索結果０件の場合
  if (words.length === 0) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${words.length}`);

  const items = words;
  // 時間順
  const sorted = orderBy(items, 'lastTime');
  // 時間順で上位N件を対象とします
  const targets = sorted.length > Environment.WORDS_LIMIT ? sorted.slice(0, Environment.WORDS_LIMIT) : sorted;

  // 単語明細情報の取得
  const details = await QueryUtils.getWordDetails(targets);

  return {
    count: details.length,
    words: details,
  };
};

const EmptyResponse = (): APIs.D004Response => ({
  count: 0,
  words: [],
});
