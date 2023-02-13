import { Environment } from '@consts';

export const SUBJECT = {
  ENGLISH: '0',
  LANGUAGE: '1',
  SCIENCE: '2',
  SOCIETY: '3',
  MATHS: '4',
  HANDWRITING: '5',
};

export const GRADE = {
  GRADE_4: '4',
  GRADE_5: '5',
  GRADE_6: '6',
};

export const PATH_PATTERN = 'audios';
export const PATH_IMAGE = 'images';
export const PATH_VOICE = 'voices';
export const PATH_PUBLIC = 'public';

export const REPORT_TYPE = {
  // 日次進捗
  DAILY_PROGRESS: 'DAILY_PROGRESS',
  // 前回学習進捗
  OVERALL_TIMES: 'OVERALL_TIMES',
};

export const API_URLs = {
  describeUser: (userId: string) => `${Environment.ENDPOINT_USERS_SERVICE}/users/${userId}`,
  listAdmins: () => `${Environment.ENDPOINT_USERS_SERVICE}/users/admins`,
};

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export const ANSWER_CORRECT = '1';
export const ANSWER_INCORRECT = '0';

export const INITIAL_DATE = '19900101';
