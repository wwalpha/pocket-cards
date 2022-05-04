// API DOMAIN

export const VERSION = `${process.env.VERSION}`;

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export enum SUBJECT {
  ENGLISH,
  JAPANESE,
  SCIENCE,
  SOCIETY,
}

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
