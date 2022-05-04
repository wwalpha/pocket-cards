import { App } from 'typings';

export const ROUTE_PATH_INDEX: Record<string, number> = {
  Root: 0,
  SignIn: 1,
  SignUp: 2,
  NewPassword: 3,
  GroupList: 101,
  QuestionList: 102,
  QuestionConfirm: 103,
  Students: 110,
  Settings: 111,
};

export const ROUTE_PATHS = {
  [ROUTE_PATH_INDEX.Root]: '/',
  [ROUTE_PATH_INDEX.SignIn]: '/',
  [ROUTE_PATH_INDEX.SignUp]: '/auth/signup',
  [ROUTE_PATH_INDEX.NewPassword]: '/auth/newpassword',
  [ROUTE_PATH_INDEX.Login]: '/login',
  [ROUTE_PATH_INDEX.GroupList]: '/group',
  [ROUTE_PATH_INDEX.QuestionList]: '/questions',
  [ROUTE_PATH_INDEX.QuestionConfirm]: '/questions/confirm',
  [ROUTE_PATH_INDEX.Students]: '/students',
  [ROUTE_PATH_INDEX.Settings]: '/settings',
};

export const PATHS_ROOT = ROUTE_PATHS[ROUTE_PATH_INDEX.Root];

// admin
export const PATHS_GROUP_LIST = ROUTE_PATHS[ROUTE_PATH_INDEX.GroupList];
export const PATHS_QUESTION_LIST = ROUTE_PATHS[ROUTE_PATH_INDEX.QuestionList];
export const PATHS_QUESTION_CONFIRM = ROUTE_PATHS[ROUTE_PATH_INDEX.QuestionConfirm];

export const PATHS_STUDENTS = ROUTE_PATHS[ROUTE_PATH_INDEX.Students];
export const PATHS_SETTINGS = ROUTE_PATHS[ROUTE_PATH_INDEX.Settings];

// user auth
export const PATHS_SIGN_UP = ROUTE_PATHS[ROUTE_PATH_INDEX.SignUp];
export const PATHS_SIGN_IN = ROUTE_PATHS[ROUTE_PATH_INDEX.SignIn];
export const PATHS_NEW_PASSWORD = ROUTE_PATHS[ROUTE_PATH_INDEX.NewPassword];
