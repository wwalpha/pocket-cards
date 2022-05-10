import { Request } from 'express';
import orderBy from 'lodash/orderBy';
import { DBHelper, Logger, DateUtils, QueryUtils } from '@utils';
import { Environment } from '@consts';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

/** 新規学習 */
export default async (req: Request<APIs.C006Params, any, any, any>): Promise<APIs.C006Response> => {
  const groupId = req.params.groupId;

  const queryResult = await DBHelper().query<Tables.TWords>(Words.query.news(groupId, DateUtils.getNow()));

  // 検索結果０件の場合
  if (queryResult.Count === 0 || !queryResult.Items) {
    return EmptyResponse();
  }

  Logger.info(`Count: ${queryResult.Count}`);

  const items = queryResult.Items;
  // 時間順
  const sorted = orderBy(items, 'lastTime');
  // 時間順で上位N件を対象とします
  const targets = sorted.length > Environment.WORDS_LIMIT ? sorted.slice(0, Environment.WORDS_LIMIT) : sorted;
  // 単語明細情報の取得
  const results = await QueryUtils.getWordDetails(targets);

  return {
    count: results.length,
    words: results,
  };
};

const EmptyResponse = (): APIs.C006Response => ({
  count: 0,
  words: [],
});
