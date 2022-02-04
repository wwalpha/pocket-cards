import { Request } from 'express';
import { Commons, DBHelper, Logger, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { Words, WordMaster, Groups } from '@queries';
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

    results.push(items.splice(random, 1)[0]);
  }

  return results;
};

/** 単語明細情報の取得 */
const getDetails = async (words: Tables.TWords[]) => {
  const tasks = words.map((item) => DBHelper().get<Tables.TWordMaster>(WordMaster.get(item.id)));
  const details = (await Promise.all(tasks))
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.info('検索結果', details);

  // 返却結果
  const rets: APIs.WordItem[] = [];

  words.forEach((t) => {
    const item = details.find((w) => w.id === t.id);

    // 明細情報存在しないデータを除外する
    if (!item) return;

    rets.push({
      id: item.id,
      mp3: item.mp3,
      pronounce: item.pronounce,
      vocChn: item.vocChn,
      vocJpn: item.vocJpn,
      times: t.times,
    } as APIs.WordItem);
  });

  return rets;
};
