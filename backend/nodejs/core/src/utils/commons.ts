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
  const key: string = `${Consts.PATH_PATTERN}/${prefix}/${filename}`;

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

const createJapaneseVoice = async (text: string, groupId: string, s3Key?: string) => {
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

  const prefix = `${Consts.PATH_VOICE}/${groupId}`;
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

  return key;
};

export const updateQuestion = async (q: Tables.TQuestions[]) => {
  const limit = pLimit(25);

  const tasks = q.map((item) =>
    limit(async () => {
      const results = await Promise.all([
        createQuestionVoice(item),
        createAnswerVoice(item),
        createImage(item.title),
        createImage(item.answer),
      ]);

      // const info = await DBHelper().get<Tables.TQuestions>(
      //   Questions.get({
      //     id: item.id,
      //   })
      // );

      // if (!info?.Item) return;

      // const tasks: Promise<void>[] = [
      //   async () => {
      //     if (info.Item?.title === item.title) return;

      //     item.voiceTitle = await createQuestionVoice(item);
      //   },
      // ];

      // if (info.Item.title !== item.title) {
      //   tasks.push(createQuestionVoice(item));
      // }

      // if (info.Item.answer !== item.answer) {
      //   tasks.push(createAnswerVoice(item));
      // }

      // tasks.push(createImage(item.title));
      // tasks.push(createImage(item.answer));

      // const results = await Promise.all(tasks);

      item.voiceTitle = results[0];
      item.voiceAnswer = results[1];
      item.title = results[2];
      item.answer = results[3];

      await QuestionService.update(item);
    })
  );

  // 非同期一括実行する
  await Promise.all(tasks);
};

const createQuestionVoice = async (question: Tables.TQuestions) => {
  const newTitle = question.title.replace(/\[http(s?):\/\/.*\]$/, '');

  if (newTitle.length === 0) return undefined;

  return await createJapaneseVoice(newTitle, question.groupId, question.voiceTitle);
};

const createAnswerVoice = async (question: Tables.TQuestions) => {
  // 選択問題の回答音声不要
  if (question.choices) return undefined;

  // URL を取り除く
  const newAnswer = question.answer.replace(/\[http(s?):\/\/.*\]$/, '');

  if (newAnswer.length === 0) return undefined;

  return await createJapaneseVoice(newAnswer, question.groupId, question.voiceAnswer);
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
