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

export const SIGN_IN = '/';
export const SIGN_UP = '/auth/signup';
export const NEW_PASSWORD = '/auth/newpassword';

export const STUDENTS = '/students';
export const SETTINGS = '/settings';

export const ABILITIES = '/abilities';
export const ABILITIES_REGIST = '/abilities/regist';
export const ABILITIES_QUESTIONS = (groupId: string = ':groupId') => `/abilities/groups/${groupId}/questions`;
