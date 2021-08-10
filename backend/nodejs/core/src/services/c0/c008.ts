import { Request } from 'express';
import { DBHelper, Logger } from '@utils';
import { Environment } from '@consts';
import { Words, WordMaster } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request): Promise<APIs.C008Response> => {
  const params = req.params as unknown as APIs.C008Params;
  const groupId = params.groupId;

  const queryResult = await DBHelper().query<Tables.TWords>(Words.query.review(groupId));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  const items = queryResult.Items;
  // 時間順で上位N件を対象とします
  const targets = getRandom(items, Environment.WORDS_LIMIT);
  // 単語明細情報の取得
  const results = await getDetails(targets);

  return {
    count: results.length,
    words: results,
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
      word: item.id,
      mp3: item.mp3,
      pronounce: item.pronounce,
      vocChn: item.vocChn,
      vocJpn: item.vocJpn,
      times: t.times,
    } as APIs.WordItem);
  });

  return rets;
};
