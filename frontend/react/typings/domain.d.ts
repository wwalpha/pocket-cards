import { CognitoUser } from '@aws-amplify/auth';
import { E001Response, WordItem } from './api';
import { GroupInfo, GroupWordsItem } from './types';

export interface State {
  // App共通設定
  app: App;
  group: Group;
  word: Word;
  user: User;
}

export interface App {
  tabIndex: number;
  isLoading: boolean;
  user: CognitoUser | undefined;
  groupId: string;
  status: string;
  displayCtrl: { [key: number]: boolean };
}

export interface Group {
  rows: GroupInfo[];
  // words: GroupWordsItem[];
  // isLoading: boolean;
  // wordDetail?: E001Response;
}

export interface User {
  remainingTest: number;
  remainingReview: number;
  daily: number;
  dailyNew: number;
  dailyReview: number;
  weekly: number;
  monthly: number;
}

export interface Word {
  current?: WordItem;
  mode?: string;
  rows: WordItem[];
  history: WordItem[];
  index: number;
}
