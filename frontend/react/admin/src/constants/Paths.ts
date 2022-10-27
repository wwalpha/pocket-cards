export const ROOT = '/';
export const GROUP_ROOT = (subject: string = ':subject') => `/${subject}/groups`;
export const GROUP_QUESTIONS = (subject: string = ':subject', groupId: string = ':groupId') =>
  `/${subject}/groups/${groupId}/questions`;
export const GROUP_EDIT = (subject: string = ':subject', groupId: string = ':groupId') =>
  `/${subject}/groups/${groupId}`;
export const GROUP_REGIST = (subject: string = ':subject') => `/${subject}/groups/regist`;

export const GROUP_UPLOAD = (subject: string = ':subject', groupId: string = ':groupId') =>
  `/${subject}/groups/${groupId}/upload`;

export const GROUP_UPLOAD_CONFIRM = `/:subject/groups/:groupId/confirm`;

export const GROUP_UPLOAD_CONFIRM_PUSH = (subject: string, groupId: string) => `/${subject}/groups/${groupId}/confirm`;

// ログイン画面
export const SIGN_IN = '/';
// 新規登録画面
export const SIGN_UP = '/auth/signup';
// パスワード変更画面
export const NEW_PASSWORD = '/auth/newpassword';

// 生徒画面
export const STUDENTS = '/students';
// 設定画面
export const SETTINGS = '/settings';

export const WEEKLY = '/weekly';

export const CURRICULUM_ORDER = '/curriculums';
export const HISTORY = '/history';

export const MULTI_TEST = '/multitest';
export const INQUIRY = '/inquiry';
export const PROGRESS = '/progress';
