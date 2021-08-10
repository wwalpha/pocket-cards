import { Request } from 'express';
import { API, Commons, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Groups } from '@queries';
import { getUserId } from '@src/utils/commons';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

/** グループ単語新規追加 */
export default async (req: Request<APIs.C001Params, any, APIs.C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const words = input.words.map((item) => item.toLowerCase());
  const userId = getUserId(req);

  // 既存単語マスタを検索する
  const tasks = words.map((item) => DBHelper().get<Tables.TWordMaster>(WordMaster.get(item)));
  const dict = (await Promise.all(tasks))
    .filter((item) => item)
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // 新規追加の単語
  const news = words.filter((item) => !dict.find((r) => r.id === item));

  // 辞書に追加する
  const newDict = await registDictionary(news);

  // Wordsのデータ登録
  await registWords(userId, groupId, words, [...dict, ...newDict]);
};

/** Wordsのデータ登録 */
const registWords = async (userId: string, groupId: string, words: string[], master: Tables.TWordMaster[]) => {
  // 単語は全部小文字で処理する
  const records = words.map<Tables.TWords>((id) => {
    const record = master.find((item) => item.id === id);

    if (!record) {
      throw new Error('Word Not Found');
    }

    return {
      id: id,
      groupId: groupId,
      nextTime: DateUtils.getNow(),
      times: 0,
      vocabulary: record.vocJpn,
    };
  });

  // 一括登録
  await DBHelper().bulk(Environment.TABLE_NAME_WORDS, records);

  // 単語の件数を更新する
  await DBHelper().update(Groups.update.addCount(groupId, userId, records.length));
};

/**
 * 単語辞書の登録
 *
 * @param words
 * @returns
 */
const registDictionary = async (words: string[]) => {
  // 単語登録用の情報を収集する
  const tasks = words.map((item) =>
    Promise.all([
      API.getPronounce(item),
      Commons.saveWithMP3(item),
      API.getTranslate(item, 'zh'),
      API.getTranslate(item, 'ja'),
    ])
  );

  const result = await Promise.all(tasks);

  Logger.info('単語情報を収集しました.');

  // 単語登録情報
  const wordInfos = result.map<Tables.TWordMaster>((item) => ({
    id: item[0].word,
    pronounce: item[0].pronounce,
    mp3: item[1],
    vocChn: item[2],
    vocJpn: item[3],
  }));

  // 単語一括登録
  await DBHelper().bulk(Environment.TABLE_NAME_WORD_MASTER, wordInfos);

  Logger.info('単語辞書の登録は完了しました.');

  return wordInfos;
};
