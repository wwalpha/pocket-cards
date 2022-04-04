import { App } from 'typings';

export const ROUTE_PATH_INDEX: Record<string, number> = {
  Root: 0,
  SignIn: 1,
  SignUp: 2,
  NewPassword: 3,
  Regist: 11,
  RegistList: 12,
  RegistFinish: 13,
  Study: 21,
  StudyRegist: 22,
  StudyCard: 23,
  StudyFinish: 24,
  StudyEdit: 25,
  StudyStatus: 26,
  MyPage: 31,
  Settings: 41,
  Groups: 61,
  GroupRegist: 62,
  GroupEdit: 63,
  Todos: 71,
  AdminDashboard: 100,
  AdminGroupDetails: 101,
  AdminGroupQuestions: 102,
  GuardianTop: 110,
};

export const ROUTE_PATHS = {
  [ROUTE_PATH_INDEX.Root]: '/',
  [ROUTE_PATH_INDEX.SignIn]: '/',
  [ROUTE_PATH_INDEX.SignUp]: '/auth/signup',
  [ROUTE_PATH_INDEX.NewPassword]: '/auth/newpassword',
  [ROUTE_PATH_INDEX.Login]: '/login',
  [ROUTE_PATH_INDEX.Regist]: '/regist',
  [ROUTE_PATH_INDEX.RegistList]: '/regist/list',
  [ROUTE_PATH_INDEX.RegistFinish]: '/regist/finish',
  [ROUTE_PATH_INDEX.MyPage]: '/mypage',
  [ROUTE_PATH_INDEX.Settings]: '/settings',
  [ROUTE_PATH_INDEX.Groups]: '/group',
  [ROUTE_PATH_INDEX.GroupRegist]: '/group/regist',
  [ROUTE_PATH_INDEX.GroupEdit]: '/group/edit',
  [ROUTE_PATH_INDEX.Study]: '/study',
  [ROUTE_PATH_INDEX.StudyRegist]: '/study/regist',
  [ROUTE_PATH_INDEX.StudyEdit]: '/study/edit/:word',
  [ROUTE_PATH_INDEX.StudyCard]: '/study/card',
  [ROUTE_PATH_INDEX.StudyStatus]: '/study/status',
  [ROUTE_PATH_INDEX.StudyFinish]: '/study/finish',
  [ROUTE_PATH_INDEX.Todos]: '/todos',
  [ROUTE_PATH_INDEX.AdminDashboard]: '/admin',
  [ROUTE_PATH_INDEX.AdminGroupDetails]: '/admin/group',
  [ROUTE_PATH_INDEX.AdminGroupQuestions]: '/admin/questions',
  [ROUTE_PATH_INDEX.GuardianTop]: '/guardian',
  [ROUTE_PATH_INDEX.GuardianGroupQuestions]: '/guardian/questions',
};

// admin
export const PATHS_ADMIN_DASHBOARD = ROUTE_PATHS[ROUTE_PATH_INDEX.AdminDashboard];
export const PATHS_ADMIN_GROUP_DETAILS = ROUTE_PATHS[ROUTE_PATH_INDEX.AdminGroupDetails];
export const PATHS_ADMIN_GROUP_QUESTIONS = ROUTE_PATHS[ROUTE_PATH_INDEX.AdminGroupQuestions];

export const PATHS_GUARDIAN_TOP = ROUTE_PATHS[ROUTE_PATH_INDEX.GuardianTop];
export const PATHS_GUARDIAN_GROUP_QUESTIONS = ROUTE_PATHS[ROUTE_PATH_INDEX.GuardianGroupQuestions];

// user auth
export const PATHS_SIGN_UP = ROUTE_PATHS[ROUTE_PATH_INDEX.SignUp];
export const PATHS_SIGN_IN = ROUTE_PATHS[ROUTE_PATH_INDEX.SignIn];
export const PATHS_NEW_PASSWORD = ROUTE_PATHS[ROUTE_PATH_INDEX.NewPassword];

export const PATHS_STUDY = ROUTE_PATHS[ROUTE_PATH_INDEX.Study];
export const PATHS_STUDY_CARD = ROUTE_PATHS[ROUTE_PATH_INDEX.StudyCard];
export const PATHS_STUDY_EDIT = ROUTE_PATHS[ROUTE_PATH_INDEX.StudyEdit];
export const PATHS_STUDY_REGIST = ROUTE_PATHS[ROUTE_PATH_INDEX.StudyRegist];
export const PATHS_STUDY_STATUS = ROUTE_PATHS[ROUTE_PATH_INDEX.StudyStatus];
export const PATHS_STUDY_FINISH = ROUTE_PATHS[ROUTE_PATH_INDEX.StudyFinish];

export const PATHS_SETTINGS = ROUTE_PATHS[ROUTE_PATH_INDEX.Settings];
export const PATHS_TODOS = ROUTE_PATHS[ROUTE_PATH_INDEX.Todos];

export const PATHS_GROUPS = ROUTE_PATHS[ROUTE_PATH_INDEX.Groups];

export const PATHS_MYPAGE = ROUTE_PATHS[ROUTE_PATH_INDEX.MyPage];

export const ROUTE_INFO: App.PathInfo = {
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Root]]: {
    showBack: false,
    showFooter: true,
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.SignIn]]: {
    showBack: false,
    showFooter: true,
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Regist]]: {
    showBack: false,
    showFooter: true,
    title: 'NEW WORDS REGIST',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.RegistList]]: {
    showBack: false,
    showFooter: true,
    title: 'NEW WORDS REGIST LIST',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.RegistFinish]]: {
    showBack: false,
    showFooter: true,
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Groups]]: {
    showBack: false,
    showFooter: true,
    title: 'FOLDER LIST',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Study]]: {
    showBack: true,
    showFooter: true,
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.StudyCard]]: {
    showBack: true,
    showFooter: false,
    title: 'STUDY CARD',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.StudyEdit]]: {
    showBack: false,
    showFooter: true,
    title: 'WORD DETAIL',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Settings]]: {
    showBack: false,
    showFooter: true,
    title: 'SETTINGS',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.StudyStatus]]: {
    showBack: true,
    showFooter: true,
    title: 'STUDY STATUS',
  },
  [ROUTE_PATHS[ROUTE_PATH_INDEX.Todos]]: {
    showBack: true,
    showFooter: true,
    title: 'TODOS',
  },
  // [ROUTE_PATH_INDEX.Login]: '/login',
  // [ROUTE_PATH_INDEX.Regist]: '/regist',
  // [ROUTE_PATH_INDEX.RegistList]: '/regist/list',
  // [ROUTE_PATH_INDEX.RegistFinish]: '/regist/finish',
  // [ROUTE_PATH_INDEX.MyPage]: '/mypage',
  // [ROUTE_PATH_INDEX.Settings]: '/settings',
  // [ROUTE_PATH_INDEX.Groups]: '/group',
  // [ROUTE_PATH_INDEX.GroupRegist]: '/group/regist',
  // [ROUTE_PATH_INDEX.GroupEdit]: '/group/edit',
  // [ROUTE_PATH_INDEX.Study]: '/study',
  // [ROUTE_PATH_INDEX.StudyRegist]: '/study/regist',
  // [ROUTE_PATH_INDEX.StudyEdit]: '/study/edit/:word',
  // [ROUTE_PATH_INDEX.StudyCard]: '/study/card',
  // [ROUTE_PATH_INDEX.StudyFinish]: '/study/finish',
};
