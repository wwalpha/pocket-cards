import { Request } from 'express';
import { API, Commons, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Groups, Words, WordIgnore } from '@queries';
import { APIs, Tables } from 'typings';

/** グループ単語新規追加 */
export default async (req: Request<APIs.C001Params, any, APIs.C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const words = input.words.map((item) => item.toLowerCase());
  const userId = Commons.getUserId(req);

  // 既存単語マスタを検索する
  const tasks = words.map((item) => registWord(item, groupId, userId));
  // regist
  await Promise.all(tasks);
};

/**
 * Regist word to group
 *
 * @param word regist word
 * @param groupId word group
 * @param userId user id
 * @returns void
 */
const registWord = async (word: string, groupId: string, userId: string) => {
  const ignoreResult = await DBHelper().get(WordIgnore.get({ id: userId, word: word }));

  // ignore word exist
  if (ignoreResult?.Item) {
    return;
  }

  // get dictionary
  const dict = await getDictionary(word);
  // exist check
  const wordsResult = await DBHelper().get(Words.get({ id: word, groupId: groupId }));

  // regist word
  await DBHelper().put(
    Words.put({
      id: word,
      groupId: groupId,
      nextTime: DateUtils.getNow(),
      times: 0,
      vocabulary: dict.vocJpn,
    })
  );

  // word exist before put
  if (!wordsResult?.Item) {
    return;
  }

  // update group word count
  await DBHelper().update(Groups.update.addCount(groupId, userId, 1));
};

const getDictionary = async (word: string): Promise<Tables.TWordMaster> => {
  const result = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(word));

  // master exist
  if (result && result.Item) {
    return result.Item;
  }

  const results = await Promise.all([
    API.getPronounce(word),
    Commons.saveWithMP3(word),
    API.getTranslate(word, 'zh'),
    API.getTranslate(word, 'ja'),
  ]);

  const record: Tables.TWordMaster = {
    id: word,
    pronounce: results[0].pronounce,
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  // regist dictionary
  await DBHelper().put(WordMaster.put(record));

  Logger.info(`単語辞書の登録は完了しました. ${word}`);

  return record;
};
