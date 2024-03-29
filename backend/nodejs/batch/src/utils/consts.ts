export enum SUBJECT {
  ENGLISH,
  JAPANESE,
  SCIENCE,
  SOCIETY,
  MATHS,
}

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export const REPORT_TYPE = {
  // 日次進捗
  DAILY_PROGRESS: 'DAILY_PROGRESS',
  // 前回学習進捗
  OVERALL_TIMES: 'OVERALL_TIMES',
};

export const INITIAL_DATE = '19900101';
