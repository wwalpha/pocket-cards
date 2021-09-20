/** aws region */
export const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION as string;
/** all environment variables */
/** tables */
export const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS as string;
export const TABLE_NAME_GROUPS = process.env.TABLE_NAME_GROUPS as string;
export const TABLE_NAME_WORDS = process.env.TABLE_NAME_WORDS as string;
export const TABLE_NAME_WORD_MASTER = process.env.TABLE_NAME_WORD_MASTER as string;
export const TABLE_NAME_WORD_IGNORE = process.env.TABLE_NAME_WORD_IGNORE as string;
export const TABLE_NAME_HISTORIES = process.env.TABLE_NAME_HISTORIES as string;

export const PATH_PATTERN = process.env.PATH_PATTERN as string;
// 最大単語数、default 10件
export const WORDS_LIMIT = process.env.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;

export const BUCKET_NAME_FRONTEND = process.env.BUCKET_NAME_FRONTEND as string;

export const IPA_API_URL = process.env.IPA_API_URL as string;
export const IPA_API_KEY = process.env.IPA_API_KEY as string;
export const TRANSLATION_API_URL = process.env.TRANSLATION_API_URL as string;
export const TRANSLATION_API_KEY = process.env.TRANSLATION_API_KEY as string;
export const VISION_API_URL = process.env.VISION_API_URL as string;
export const VISION_API_KEY = process.env.VISION_API_KEY as string;
