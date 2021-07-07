import { AWSError, Polly, S3 } from 'aws-sdk';
import axios from 'axios';
import { Request } from 'express';
import * as short from 'short-uuid';
import { ClientUtils, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Groups, Words } from '@queries';
import { getUserId } from '@src/utils/commons';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

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
  const tasks = words.map((id) => {
    const record = master.find((item) => item.id === id);

    if (!record) {
      throw new Error('Word Not Found');
    }

    return DBHelper().put(
      Words.put({
        id: id,
        groupId: groupId,
        nextTime: DateUtils.getNow(),
        times: 0,
        vocabulary: record.vocJpn,
      })
    );
  });

  try {
    // グループ単語登録
    await Promise.all(tasks);
  } catch (err) {
    // キー既存あり以外の場合、エラーとする
    if ((err as AWSError).code !== 'ConditionalCheckFailedException') {
      throw err;
    }
  }

  // 単語の件数を更新する
  DBHelper().update(Groups.update.addCount(groupId, userId, tasks.length));
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
    Promise.all([getPronounce(item), saveWithMP3(item), getTranslate(item, 'zh'), getTranslate(item, 'ja')])
  );

  const result = await Promise.all(tasks);

  Logger.info('単語情報を収集しました.');

  // 単語登録情報
  const wordInfos = result.map(
    (item) =>
      ({
        id: item[0]['word'],
        pronounce: item[0]['pronounce'],
        mp3: item[1],
        vocChn: item[2],
        vocJpn: item[3],
      } as Tables.TWordMaster)
  );

  // 単語登録タスク作成
  const registTasks = wordInfos.map((item) => DBHelper().put(WordMaster.put(item)));
  // 単語一括登録
  await Promise.all(registTasks);

  Logger.info('単語辞書の登録は完了しました.');

  return wordInfos;
};

/** 発音データ取得する */
const getPronounce = async (word: string): Promise<Record<string, string>> => {
  const res = await axios.get(`${Environment.IPA_URL}?word=${word}`, {
    headers: {
      'x-api-key': Environment.IPA_API_KEY,
    },
  });

  return res.data;
};

/** 単語のMP3を生成し、S3に保存する */
const saveWithMP3 = async (word: string): Promise<string> => {
  const client = ClientUtils.polly();

  const request: Polly.SynthesizeSpeechInput = {
    Text: word,
    TextType: 'text',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US',
  };

  const response = await client.synthesizeSpeech(request).promise();

  // ファイル名
  const filename: string = `${short.generate()}.mp3`;
  const prefix: string = DateUtils.getNow();
  const key: string = `${Environment.PATH_PATTERN}/${prefix}/${filename}`;

  const putRequest: S3.Types.PutObjectRequest = {
    Bucket: Environment.AUDIOS_BUCKET,
    Key: key,
    Body: response.AudioStream,
  };

  const s3Client = ClientUtils.s3();

  // S3に保存する
  await s3Client.putObject(putRequest).promise();

  return key;
};

/** 翻訳 */
const getTranslate = async (word: string, targetLanguageCode: string) => {
  const {
    data: {
      data: { translations },
    },
  } = await axios.post(`${Environment.TRANSLATION_URL}?key=${Environment.TRANSLATION_API_KEY}`, {
    q: word,
    from: 'en',
    target: targetLanguageCode,
    format: 'text',
  });

  // 結果ない場合、エラーとする
  if (!translations || translations.length === 0) {
    throw new Error(`翻訳できません。Word:${word}`);
  }

  return translations[0].translatedText;
};
