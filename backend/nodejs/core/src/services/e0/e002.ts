import { Request } from 'express';
import { DBHelper, API, Commons } from '@utils';
import { WordMaster } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<APIs.E002Params, any, APIs.E002Request, any>): Promise<APIs.E002Response> => {
  const word = req.params.word;
  const input = req.body;

  const record = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(word));

  // 単語が存在しない場合
  if (!record || !record.Item) {
    // 新規追加
    const newWord = await addNew(word);

    return newWord;
  }

  // 既存更新
  await update(word, input);

  return input;
};

const addNew = async (word: string) => {
  // 新規単語追加
  const results = await Promise.all([
    API.getPronounce(word),
    Commons.saveWithMP3(word),
    API.getTranslate(word, 'zh'),
    API.getTranslate(word, 'ja'),
  ]);

  const original = word.indexOf('+') !== -1 ? word.split('+').join(' ') : word;

  const item: Tables.TWordMaster = {
    id: word,
    original: original,
    pronounce: results[0]['pronounce'],
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  // DB 更新
  await DBHelper().put(WordMaster.put(item));

  return item;
};

const update = async (word: string, input: APIs.E002Request) => {
  // 音声の再取得
  const mp3 = await Commons.saveWithMP3(word);

  // 単語詳細情報を取得する
  await DBHelper().put(
    WordMaster.put({
      id: word,
      original: input.original,
      mp3: mp3,
      pronounce: input.pronounce,
      vocChn: input.vocChn,
      vocJpn: input.vocJpn,
    })
  );
};
