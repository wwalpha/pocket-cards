import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { DBHelper, Logger, DateUtils } from '@utils';
import { Environment } from '@consts';
import { Words, WordMaster } from '@queries';
import { API, Table } from 'typings';

export default async (req: Request<API.C006Params, any, any, any>): Promise<API.C006Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query(Words.query.news(groupId, DateUtils.getNow()));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${queryResult.Count}`);

  const items = queryResult.Items as Table.TWords[];
  // 時間順
  const sorted = orderBy(items, 'lastTime');
  // 時間順で上位N件を対象とします
  const targets = sorted.length > Environment.WORDS_LIMIT ? items.slice(0, Environment.WORDS_LIMIT) : items;
  // 単語明細情報の取得
  const results = await getDetails(targets);

  return {
    count: results.length,
    words: results,
  };
};

const EmptyResponse = (): API.C006Response => ({
  count: 0,
  words: [],
});

/** 単語明細情報の取得 */
const getDetails = async (words: Table.TWords[]) => {
  // 単語明細情報を取得する
  const tasks = words.map((item) => DBHelper().get(WordMaster.get(item.id)));
  const details = (await Promise.all(tasks)).filter((item) => item);

  Logger.info('検索結果', details);

  // 返却結果
  const rets: API.WordItem[] = [];

  words.forEach((t) => {
    const finded = details.find((w) => (w.Item as Table.TWordMaster).id === t.id);

    // 明細情報存在しないデータを除外する
    if (!finded) return;

    const item = finded.Item as Table.TWordMaster;

    rets.push({
      word: item.id,
      mp3: item.mp3,
      pronounce: item.pronounce,
      vocChn: item.vocChn,
      vocJpn: item.vocJpn,
      times: t.times,
    } as API.WordItem);
  });

  return rets;
};
