import * as short from 'short-uuid';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { ClientUtils, DateUtils, Logger } from '@utils';
import { ssm } from './clientUtils';
import { Polly, S3 } from 'aws-sdk';
import { Environment, Consts } from '@consts';
import { GetItemOutput } from '@alphax/dynamodb';
import { getImage } from './apis';

// Sleep
export const sleep = (timeout: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), timeout));

/**
 * Header情報からUserIdを取得する(Cognito Authorization IdToken)
 *
 * @param event APIGateway EVENT
 * @param authKey Header Key
 */
export const getUserId = (req: Request<any, any, any, any>, authKey: string = 'authorization') => {
  const value = req.headers[authKey] as string;

  // データが存在しない場合、エラーとする
  if (!value) {
    throw new Error('Can not found User Id.');
  }

  return getUserInfo(value);
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
  const client = ssm();

  const result = await client
    .getParameter({
      Name: key,
      WithDecryption: true,
    })
    .promise();

  if (!result.Parameter || !result.Parameter.Value) {
    throw new Error('Can not get parameters.');
  }

  return result.Parameter.Value;
};

/** 単語のMP3を生成し、S3に保存する */
export const saveWithMP3 = async (word: string): Promise<string> => {
  const client = ClientUtils.polly();

  const request: Polly.SynthesizeSpeechInput = {
    Text: getOriginal(word),
    TextType: 'text',
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
    LanguageCode: 'en-US',
  };

  const response = await client.synthesizeSpeech(request).promise();

  // ファイル名
  const filename: string = `${short.generate()}.mp3`;
  const prefix: string = DateUtils.getNow();
  const key: string = `${Consts.PATH_PATTERN}/${prefix}/${filename}`;

  const putRequest: S3.Types.PutObjectRequest = {
    Bucket: Environment.BUCKET_NAME_FRONTEND,
    Key: key,
    Body: response.AudioStream,
  };

  const s3Client = ClientUtils.s3();

  // S3に保存する
  await s3Client.putObject(putRequest).promise();

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

export const generateImage = async (url: string): Promise<string> => {
  const filename: string = `${short.generate()}`;
  const filedata: string = await getImage(url);
  const extension: string | undefined = url.split('.').pop();
  const key: string = `${Consts.PATH_IMAGE}/${filename}.${extension}`;

  const putRequest: S3.Types.PutObjectRequest = {
    Bucket: Environment.BUCKET_NAME_MATERAILS,
    Key: key,
    Body: filedata,
  };

  // S3に保存する
  await ClientUtils.s3().putObject(putRequest).promise();

  return key;
};
