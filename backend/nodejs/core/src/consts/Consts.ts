import { Environment } from '@consts';

export const SUBJECT = {
  LANGUAGE: '1',
  SCIENCE: '2',
  SOCIETY: '3',
  ENGLISH: '0',
};

export const PATH_PATTERN = 'pattern';
export const PATH_IMAGE = 'images';
export const PATH_VOICE = 'voices';

export const REPORT_TYPE = {
  // 日次進捗
  DAILY_PROGRESS: 'DAILY_PROGRESS',
  // 前回学習進捗
  OVERALL_TIMES: 'OVERALL_TIMES',
};

export const API_URLs = {
  describeUser: (userId: string) => `${Environment.ENDPOINT_USERS_SERVICE}/users/${userId}`,
};

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};
