/** aws region */
export const AWS_DEFAULT_REGION = process.env['AWS_DEFAULT_REGION'] as string;
/** all environment variables */
/** tables */
export const TABLE_NAME_USERS = process.env['TABLE_NAME_USERS'] as string;
export const TABLE_NAME_USER_WORDS = process.env['TABLE_NAME_USER_WORDS'] as string;
export const TABLE_NAME_GROUPS = process.env['TABLE_NAME_GROUPS'] as string;
export const TABLE_NAME_WORD_MASTER = process.env['TABLE_NAME_WORD_MASTER'] as string;
export const TABLE_NAME_WORD_IGNORE = process.env['TABLE_NAME_WORD_IGNORE'] as string;
export const TABLE_NAME_TRACES = process.env['TABLE_NAME_TRACES'] as string;
export const TABLE_NAME_QUESTIONS = process.env['TABLE_NAME_QUESTIONS'] as string;
export const TABLE_NAME_LEARNING = process.env['TABLE_NAME_LEARNING'] as string;
export const TABLE_NAME_CURRICULUMS = process.env['TABLE_NAME_CURRICULUMS'] as string;
export const TABLE_NAME_REPORTS = process.env['TABLE_NAME_REPORTS'] as string;
export const TABLE_NAME_INQUIRY = process.env['TABLE_NAME_INQUIRY'] as string;
export const TABLE_NAME_ACCURACY = process.env['TABLE_NAME_ACCURACY'] as string;

// 最大単語数、default 15 件
export const WORDS_LIMIT = process.env['WORDS_LIMIT'] ? Number(process.env['WORDS_LIMIT']) : 15;

export const BUCKET_NAME_FRONTEND = process.env['BUCKET_NAME_FRONTEND'] as string;
export const BUCKET_NAME_MATERAILS = process.env['BUCKET_NAME_MATERAILS'] as string;
export const BUCKET_NAME_UPLOADS = process.env['BUCKET_NAME_UPLOADS'] as string;

export const IPA_API_URL = process.env['IPA_API_URL'] as string;
export const IPA_API_KEY = process.env['IPA_API_KEY'] as string;
export const TRANSLATION_API_URL = process.env['TRANSLATION_API_URL'] as string;
export const TRANSLATION_API_KEY = process.env['TRANSLATION_API_KEY'] as string;
export const VISION_API_URL = process.env['VISION_API_URL'] as string;
export const VISION_API_KEY = process.env['VISION_API_KEY'] as string;

export const ENDPOINT_USERS_SERVICE = process.env['ENDPOINT_USERS_SERVICE'] as string;

export const MASTER_EMAIL_ADDRESS = process.env['MASTER_EMAIL_ADDRESS'] as string;

export const TIMESTREAM_DATABASE = process.env['TIMESTREAM_DATABASE'] as string;
export const TIMESTREAM_TABLE_TRACES = process.env['TIMESTREAM_TABLE_TRACES'] as string;
