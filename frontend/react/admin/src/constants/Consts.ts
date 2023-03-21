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
  JAPANESE: '1',
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
  JAPANESE: '#b71927',
  SCIENCE: '#f19116',
  SOCIETY: '#288f46',
  ENGLISH: '#b71927',
  MATHS: '#1B5AAA',
  MULTI_TEST: '#6F38C5',
  INQUIRY: '#233163',
  HANDWRITING: '#242424',
  PROGRESS: '#FF6464',
  OVERALL: '#1a237e',
};

export const PATH_IMAGE = 'images';
export const PATH_VOICE = 'voices';

export const Commands = {
  SHOW_NEXT: 'SHOW_NEXT',
  SHOW_ANSWER: 'SHOW_ANSWER',
  SHOW_CORRECT: 'SHOW_CORRECT',
};

export const MSG_001 = '登録成功しました';

export const DIALOG_STATUS = {
  CLOSE: '0',
  EDIT: '1',
  TRANSFER: '2',
};

export const CHART_COLORS = ['#f44336', '#ffeb3b', '#357a38', '#3f51b5', '#673ab7', '#9c27b0', '#795548', '#212121'];
