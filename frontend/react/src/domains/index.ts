import { App, Group, User, Word } from 'typings/domain';

export interface State {
  // App共通設定
  app: App;
  group: Group;
  word: Word;
  user: User;
}

export { default as AppState } from './App';
export { default as Group } from './Group';
export { default as User } from './User';
export { default as Word } from './Word';
