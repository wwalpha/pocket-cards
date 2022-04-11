import { Request } from 'express';
import { Commons, DBHelper, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { Words, Groups } from '@queries';
import { APIs, Tables } from 'typings';

/** 今日の復習 */
export default async (req: Request): Promise<APIs.D006Response> => {
  // ユーザID
  const userId = Commons.getUserId(req);
  // ユーザのグループ一覧を取得する
  const userInfo = await DBHelper().query<Tables.TGroups>(Groups.query.byUserId(userId));

  const groups = userInfo.Items;

  // グループ存在しない
  if (!groups || groups.length === 0) {
    return EmptyResponse();
  }

  // get test items
  const tasks = groups.map((item) => DBHelper().query<Tables.TWords>(Words.query.review(item.id)));
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

  const items = words;
  // 時間順で上位N件を対象とします
  const targets = getRandom(items, Environment.WORDS_LIMIT);
  // 単語明細情報の取得
  const details = await QueryUtils.getWordDetails(targets);

  return {
    count: details.length,
    words: details,
  };
};

const EmptyResponse = (): APIs.C008Response => ({
  count: 0,
  words: [],
});

const getRandom = (items: Tables.TWords[], maxItems: number): Tables.TWords[] => {
  if (maxItems >= items.length) {
    return items;
  }

  const results: Tables.TWords[] = [];

  while (results.length != maxItems) {
    const min = 0;
    const max = items.length - 1;

    const random = Math.floor(Math.random() * (max + 1 - min)) + min;
    const item = items.splice(random, 1)[0];

    if (item) {
      results.push(item);
    }
  }

  return results;
};
