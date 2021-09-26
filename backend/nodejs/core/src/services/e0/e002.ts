import { Request } from 'express';
import { DBHelper, API, Commons } from '@utils';
import { WordMaster } from '@queries';
import { APIs, Tables } from 'typings';
import { isEmpty } from 'lodash';

export default async (req: Request<APIs.E002Params, any, APIs.E002Request, any>): Promise<APIs.E002Response> => {
  const word = req.params.word;
  const input = req.body;

  // validation
  validate(req.body);

  const record = await getMaster(word);

  // 単語が存在しない場合
  if (Commons.isEmpty(record)) {
    // 新規追加
    return await addNew(word);
  }

  // Original 単語変更
  if (word !== Commons.word2Id(input.original)) {
    const record = await getMaster(input.original);

    // original word not exist
    if (Commons.isEmpty(record)) {
      return await addNew(input.original);
    }
  }

  // 既存更新
  return await update(word, input);
};

/** validation function */
const validate = (req: APIs.E002Request) => {
  // required
  if (isEmpty(req.original)) throw new Error('Original not found');
};

const getMaster = async (word: string) => await DBHelper().get<Tables.TWordMaster>(WordMaster.get(word));

/** add new word */
const addNew = async (word: string): Promise<Tables.TWordMaster> => {
  // 新規単語追加
  const results = await Promise.all([
    API.getPronounce(word),
    Commons.saveWithMP3(word),
    API.getTranslate(word, 'zh'),
    API.getTranslate(word, 'ja'),
  ]);

  const record = {
    id: word,
    original: Commons.getOriginal(word),
    pronounce: results[0]['pronounce'],
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  const putItem = WordMaster.put(record);
  // condition
  putItem.ConditionExpression = 'attribute_not_exists(id)';

  try {
    // DB 更新
    await DBHelper().put(putItem);
  } catch (err) {
    if ((err as any).code !== 'ConditionalCheckFailedException') {
      console.log(err);
    }
  }

  return record;
};

/** update master properties */
const update = async (word: string, input: APIs.E002Request) => {
  // 音声の再取得
  const mp3 = await Commons.saveWithMP3(word);

  const putItem: Tables.TWordMaster = {
    id: word,
    original: input.original,
    mp3: mp3,
    pronounce: input.pronounce,
    vocChn: input.vocChn,
    vocJpn: input.vocJpn,
  };

  // 単語詳細情報を取得する
  await DBHelper().put(WordMaster.put(putItem));

  return putItem;
};
