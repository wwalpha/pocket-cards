// API DOMAIN

export const VERSION = `${process.env.VERSION}`;
export const DOMAIN_HOST = `${process.env.DOMAIN_HOST}`;

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export const SUBJECT = {
  ENGLISH: '0',
  LANGUAGE: '1',
  SCIENCE: '2',
  SOCIETY: '3',
  MATHS: '4',
  HANDWRITING: '5',
};

export const SUBJECT_NORMAL = [SUBJECT.ENGLISH, SUBJECT.LANGUAGE, SUBJECT.SCIENCE, SUBJECT.SOCIETY, SUBJECT.MATHS];

export enum SIGN_STATUS {
  NOT_LOGIN,
  NEW_PASSWORD_REQUIRED,
  MFA_REQUIRED,
  LOGINED,
}

export enum EDIT_MODE {
  REGIST,
  EDIT,
  READONLY,
}

export const COLORS = {
  LANGUAGE: '#b71927',
  SCIENCE: '#f19116',
  SOCIETY: '#288f46',
  ENGLISH: '#b71927',
  MATHS: '#1B5AAA',
  MULTI_TEST: '#6F38C5',
  INQUIRY: '#233163',
  HANDWRITING: '#242424',
};

export const PATH_IMAGE = 'images';
export const PATH_VOICE = 'voices';

export const Commands = {
  SHOW_NEXT: 'SHOW_NEXT',
  SHOW_ANSWER: 'SHOW_ANSWER',
  SHOW_CORRECT: 'SHOW_CORRECT',
};

export const MSG_001 = '登録成功しました';
