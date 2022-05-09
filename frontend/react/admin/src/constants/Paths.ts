export type RouteKeys =
  | 'ROOT'
  | 'ROOT_LANGUAGE'
  | 'ROOT_SCIENCE'
  | 'ROOT_SOCIETY'
  | 'ROOT_ENGLISH'
  | 'SIGN_IN'
  | 'SIGN_UP'
  | 'NEW_PASSWORD'
  | 'GROUP_LIST'
  | 'QUESTION_LIST'
  | 'QUESTION_CONFIRM'
  | 'STUDENTS'
  | 'SETTINGS'
  | 'ABILITIES'
  | 'ABILITIES_REGIST';

export const ROUTE_PATHS: Record<RouteKeys, string> = {
  ROOT: '/',
  ROOT_LANGUAGE: '/language',
  ROOT_SCIENCE: '/science',
  ROOT_SOCIETY: '/society',
  ROOT_ENGLISH: '/english',
  SIGN_IN: '/',
  SIGN_UP: '/auth/signup',
  NEW_PASSWORD: '/auth/newpassword',
  GROUP_LIST: '/group',
  QUESTION_LIST: '/questions',
  QUESTION_CONFIRM: '/questions/confirm',
  STUDENTS: '/students',
  SETTINGS: '/settings',
  ABILITIES: '/abilities',
  ABILITIES_REGIST: '/abilities/regist',
};
