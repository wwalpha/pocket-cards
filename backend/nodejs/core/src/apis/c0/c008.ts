import { Request } from 'express';
import { DBHelper, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { Words } from '@queries';
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
  const results = await QueryUtils.getWordDetails(targets);

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
    const item = items.splice(random, 1)[0];

    if (item) {
      results.push(item);
    }
  }

  return results;
};
