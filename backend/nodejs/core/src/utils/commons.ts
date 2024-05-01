import { GetItemOutput } from '@alphax/dynamodb';
import { SynthesizeSpeechCommand, SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as short from 'short-uuid';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import pLimit from 'p-limit';
import { ClientUtils, DateUtils, Logger } from '@utils';
import { Environment, Consts } from '@consts';
import { QuestionService } from '@services';
import { getImage } from './apis';
import { Tables } from 'typings';

// Sleep
export const sleep = (timeout: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));

/**
 * Header情報からUserIdを取得する(Cognito Authorization IdToken)
 *
 * @param authKey Header Key
 */
export const getUserId = (req: Request<any, any, any, any>, authKey: string = 'username') => {
  const value = req.headers[authKey] as string;

  // データが存在しない場合、エラーとする
  if (!value) {
    throw new Error('Can not found User Id.');
  }

  return value;
};

/**
 * Header情報からUserIdを取得する(Cognito Authorization IdToken)
 *
 * @param authKey Header Key
 */
export const getGuardian = (req: Request<any, any, any, any>, authKey: string = 'guardian') => {
  const value = req.headers[authKey] as string;

  // データが存在しない場合、エラーとする
  if (!value) {
    throw new Error('Can not found guardian id.');
  }

  return value;
};

export const getUserInfo = (token: string) => {
  try {
    const jwt = decode(token, { complete: true });

    //@ts-ignore
    return jwt?.payload['cognito:username'];
  } catch (err) {
    Logger.error(err);
    return null;
  }
};

/** SSM Value */
export const getSSMValue = async (key: string) => {
  const client = ClientUtils.ssm();

  const result = await client.getParameter({
    Name: key,
    WithDecryption: true,
  });

  if (!result.Parameter || !result.Parameter.Value) {
    throw new Error('Can not get parameters.');
  }

  return result.Parameter.Value;
};

/** 単語のMP3を生成し、S3に保存する */
export const saveWithMP3 = async (word: string): Promise<string> => {
  const client = ClientUtils.polly();

  const request: SynthesizeSpeechCommandInput = {
    Text: getOriginal(word),
    TextType: 'text',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US',
  };

  const response = await client.synthesizeSpeech(request);

  // ファイル名
  const filename: string = `${short.generate()}.mp3`;
  const prefix: string = DateUtils.getNow();
  const key: string = `${Consts.PATH_AUDIOS}/${prefix}/${filename}`;

  // S3に保存する
  const upload = new Upload({
    client: ClientUtils.s3(),
    params: {
      Bucket: Environment.BUCKET_NAME_MATERAILS,
      Key: key,
      Body: response.AudioStream,
      ContentType: response.ContentType,
    },
  });

  await upload.done();

  return key;
};

export const getOriginal = (word: string) => word.split('+').join(' ');

export const word2Id = (word: string) => word.split(' ').join('+');

export const isEmpty = (item?: GetItemOutput) => {
  if (item === undefined) return true;
  if (item.Item === undefined) return true;
  return false;
};

export const isNotEmpty = (item?: GetItemOutput) => !isEmpty(item);

const generateImage = async (url: string): Promise<string> => {
  const filename: string = `${short.generate()}`;
  const filedata: Buffer | undefined = await getImage(url);
  const extension: string | undefined = url.split('.').pop();
  const key: string = `${Consts.PATH_IMAGE}/${filename}.${extension}`;

  // S3に保存する
  const upload = new Upload({
    client: ClientUtils.s3(),
    params: {
      Bucket: Environment.BUCKET_NAME_MATERAILS,
      Key: key,
      Body: filedata,
      ContentType: getContentType(extension),
    },
  });

  await upload.done();

  return key;
};

const getContentType = (extension: string = '') => {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    default:
      return '';
  }
};

const createJapaneseVoice = async (text: string, s3Key?: string) => {
  const client = ClientUtils.polly();

  const response = await client.send(
    new SynthesizeSpeechCommand({
      Text: text,
      TextType: 'text',
      VoiceId: 'Takumi',
      OutputFormat: 'mp3',
      LanguageCode: 'ja-JP',
    })
  );

  const prefix = `${Consts.PATH_AUDIOS}/${DateUtils.getNow()}`;
  const key = s3Key ?? `${short.generate()}.mp3`;

  // ファイル名
  const bucketKey: string = `${prefix}/${key}`;

  // S3に保存する
  const upload = new Upload({
    client: ClientUtils.s3(),
    params: {
      Bucket: Environment.BUCKET_NAME_MATERAILS,
      Key: bucketKey,
      Body: response.AudioStream,
      ContentType: response.ContentType,
    },
  });

  await upload.done();

  return bucketKey;
};

export const updateQuestion = async (q: Tables.TQuestions[], createVoice: boolean = true) => {
  const limit = pLimit(10);

  const tasks = q.map((item) =>
    limit(async () => {
      const tasks: Promise<string | undefined>[] = [createImage(item.title), createImage(item.answer)];

      // 音声作成する場合
      if (createVoice === true) {
        if (item.subject === Consts.SUBJECT.ENGLISH) {
          // 英語の場合
          tasks.push(saveWithMP3(item.title));
        } else {
          // 英語以外の場合
          tasks.push(createQuestionVoice(item));
          tasks.push(createAnswerVoice(item));
        }
      }

      // 一括実行する
      const results = await Promise.all(tasks);

      item.title = results[0] ?? item.title;
      item.answer = results[1] ?? item.answer;

      // 音声作成する場合
      if (createVoice === true) {
        if (item.subject === Consts.SUBJECT.ENGLISH) {
          // 英語の場合
          item.voiceTitle = results[2];
          item.voiceAnswer = undefined;
        } else {
          // 英語以外の場合
          item.voiceTitle = results[2];
          item.voiceAnswer = results[3];
        }
      }

      console.log(item.id);
      // 問題更新する
      await QuestionService.update(item);
    })
  );

  // 非同期一括実行する
  await Promise.all(tasks);
};

const createQuestionVoice = async (question: Tables.TQuestions) => {
  // 国語の問題は音声不要
  if (question.subject === Consts.SUBJECT.LANGUAGE) return undefined;

  // URL を取り除く
  let newTitle = question.title.replace(/\[http(s?):\/\/.*\]$/, '');
  if (newTitle.length === 0) return undefined;

  const startIdx = newTitle.indexOf('[images');
  if (startIdx !== -1) {
    const endIdx = newTitle.indexOf('[images', startIdx + 1);
    if (endIdx !== -1) {
      newTitle = newTitle.substring(0, startIdx) + newTitle.substring(endIdx);
    }
  }
  if (newTitle.length === 0) return undefined;

  return await createJapaneseVoice(newTitle);
};

const createAnswerVoice = async (question: Tables.TQuestions) => {
  // 国語の問題は音声不要
  if (question.subject === Consts.SUBJECT.LANGUAGE) return undefined;

  // 選択問題の回答音声不要
  if (question.choices) return undefined;

  // URL を取り除く
  let newAnswer = question.answer.replace(/\[http(s?):\/\/.*\]$/, '');
  if (newAnswer.length === 0) return undefined;

  const startIdx = newAnswer.indexOf('[images');
  if (startIdx !== -1) {
    const endIdx = newAnswer.indexOf('[images', startIdx + 1);
    if (endIdx !== -1) {
      newAnswer = newAnswer.substring(0, startIdx) + newAnswer.substring(endIdx);
    }
  }

  if (newAnswer.length === 0) return undefined;

  return await createJapaneseVoice(newAnswer);
};

const createImage = async (text: string): Promise<string> => {
  if (!text.match(/\[http(s?):\/\/.*\]/)) {
    return text;
  }

  const startIdx = text.indexOf('[http');
  const endIdx = text.indexOf(']', startIdx);
  const url = text.substring(startIdx + 1, endIdx);

  const s3Key = await generateImage(url);

  return text.replace(/\[http(s?):\/\/.*\]/, `[${s3Key}]`);
};

export const removeImage = async (text: string): Promise<void> => {
  if (!/\[.*.(jpg|png)\]/.test(text)) {
    return;
  }

  const startIdx = text.indexOf('[');
  const endIdx = text.indexOf(']', startIdx);
  const key = text.substring(startIdx + 1, endIdx);

  // S3に保存する
  await ClientUtils.s3().send(
    new DeleteObjectCommand({
      Bucket: Environment.BUCKET_NAME_MATERAILS,
      Key: key,
    })
  );
};

export const getRegistTimes = (subject: string) => {
  console.log(subject);
  // if (Consts.SUBJECT.LANGUAGE === subject) return 0;
  // if (Consts.SUBJECT.ENGLISH === subject) return 0;
  // return -1;
  return 0;
};

export const getTestTimes = (subject: string) => {
  console.log(subject);
  // if (Consts.SUBJECT.LANGUAGE === subject) return 1;
  // if (Consts.SUBJECT.ENGLISH === subject) return 1;
  // return 0;
  return 1;
};

export const removeObject = async (key: string): Promise<void> => {
  // S3に保存する
  await ClientUtils.s3().send(
    new DeleteObjectCommand({
      Bucket: Environment.BUCKET_NAME_MATERAILS,
      Key: key,
    })
  );
};
