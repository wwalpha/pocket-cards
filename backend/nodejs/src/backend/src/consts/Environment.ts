import { ENVIRONMENTS } from 'typings';

/** aws region */
export const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION as string;
/** all environment variables */
export const ENVS = JSON.parse(process.env.ENV_VARS as string) as ENVIRONMENTS;
/** tables */
export const TABLE_USERS = ENVS.DYNAMODB_TABLES.USERS;
export const TABLE_GROUPS = ENVS.DYNAMODB_TABLES.GROUPS;
export const TABLE_WORDS = ENVS.DYNAMODB_TABLES.WORDS;
export const TABLE_WORD_MASTER = ENVS.DYNAMODB_TABLES.WORD_MASTER;
export const TABLE_HISTORIES = ENVS.DYNAMODB_TABLES.HISTORY;
/** buckets */
export const AUDIOS_BUCKET = ENVS.S3_BUCKETS.AUDIOS;
export const IMAGES_BUCKET = ENVS.S3_BUCKETS.IMAGES;

export const PATH_PATTERN = ENVS.PATH_PATTERN as string;
// 最大単語数、default 10件
export const WORDS_LIMIT = ENVS.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;

export const IPA_URL = process.env.IPA_URL as string;
export const IPA_API_KEY = process.env.IPA_API_KEY as string;
export const TRANSLATION_URL = process.env.TRANSLATION_URL as string;
export const TRANSLATION_API_KEY = process.env.TRANSLATION_API_KEY as string;
export const VISION_URL = process.env.VISION_URL as string;
export const VISION_API_KEY = process.env.VISION_API_KEY as string;
