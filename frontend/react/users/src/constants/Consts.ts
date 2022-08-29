// API DOMAIN
export const API_URL = process.env.API_URL as string;
export const API_NAME = 'api';
export const API_VERSION = '/v1';
export const VERSION = `${process.env.VERSION}`;

// サーバー
export const SERVER_START_URL = () => '/admin/start';
export const SERVER_STOP_URL = () => '/admin/stop';
export const SERVER_STATUS_URL = () => '/admin/status';

export const SIGN_IN = () => `${API_VERSION}/auth/login`;
export const SIGN_UP = () => `${API_VERSION}/users`;
export const REFRESH_TOKEN = () => `${API_VERSION}/auth/refresh`;

export const STUDENT_REGIST = () => `${API_VERSION}/users/students`;
export const STUDENT_LIST = () => `${API_VERSION}/users/students`;

export const DESCRIBE_USER = (userId: string) => `${API_VERSION}/users/${userId}`;
export const UPDATE_USER = (userId: string) => `${API_VERSION}/users/${userId}`;

export const MODES = {
  Practice: '1',
  Test: '2',
};

export const PAGE_MAX_WORDS = 7;

export const SERVER_STATUS = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  PROVISIONING: 'PROVISIONING',
  ACTIVATING: 'ACTIVATING',
  PENDING: 'PENDING',
  STOPPING: 'STOPPING',
};

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};

export const HEADER_HEIGHT = 64;
export const FOOT_HEIGHT = 72;

export enum ShowTypes {
  REMOVE_WORD,
}

export const STUDY_BUFFER_LOWER_LIMIT = 4;

export const SUBJECT = {
  ENGLISH: '0',
  LANGUAGE: '1',
  SCIENCE: '2',
  SOCIETY: '3',
  MATHS: '4',
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
