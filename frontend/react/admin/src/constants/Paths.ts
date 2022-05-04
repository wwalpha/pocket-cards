export type RouteKeys =
  | 'ROOT'
  | 'SIGN_IN'
  | 'SIGN_UP'
  | 'NEW_PASSWORD'
  | 'GROUP_LIST'
  | 'QUESTION_LIST'
  | 'QUESTION_CONFIRM'
  | 'STUDENTS'
  | 'SETTINGS';

export const ROUTE_PATHS: Record<RouteKeys, string> = {
  ROOT: '/',
  SIGN_IN: '/',
  SIGN_UP: '/auth/signup',
  NEW_PASSWORD: '/auth/newpassword',
  GROUP_LIST: '/group',
  QUESTION_LIST: '/questions',
  QUESTION_CONFIRM: '/questions/confirm',
  STUDENTS: '/students',
  SETTINGS: '/settings',
};

// export const PATHS_ROOT = ROUTE_PATHS[ROUTE_PATH_INDEX.Root];

// // admin
// export const PATHS_GROUP_LIST = ROUTE_PATHS[ROUTE_PATH_INDEX.GroupList];
// export const PATHS_QUESTION_LIST = ROUTE_PATHS[ROUTE_PATH_INDEX.QuestionList];
// export const PATHS_QUESTION_CONFIRM = ROUTE_PATHS[ROUTE_PATH_INDEX.QuestionConfirm];

// export const PATHS_STUDENTS = ROUTE_PATHS[ROUTE_PATH_INDEX.Students];
// export const PATHS_SETTINGS = ROUTE_PATHS[ROUTE_PATH_INDEX.Settings];

// // user auth
// export const PATHS_SIGN_UP = ROUTE_PATHS[ROUTE_PATH_INDEX.SignUp];
// export const PATHS_SIGN_IN = ROUTE_PATHS[ROUTE_PATH_INDEX.SignIn];
// export const PATHS_NEW_PASSWORD = ROUTE_PATHS[ROUTE_PATH_INDEX.NewPassword];
