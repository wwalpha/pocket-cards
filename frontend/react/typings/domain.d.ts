import { CognitoUser } from '@aws-amplify/auth';
import { E001Response, WordItem } from './api';
import { GroupInfo, GroupWordsItem } from './types';

export interface App {
  tabIndex: number;
  isLoading: boolean;
  user: CognitoUser | undefined;
  groupId: string;
  status: string;
  displayCtrl: { [key: number]: boolean };
}

export interface Group {
  groups: GroupInfo[];
  words: GroupWordsItem[];
  isLoading: boolean;
  wordDetail?: E001Response;
}

export interface User {
  remainingTest: number;
  remainingReview: number;
  daily: number;
  dailyNew: number;
  dailyReview: number;
  weekly: number;
  monthly: number;
  isLoading: boolean;
}

export interface Word {
  current?: WordItem;
  mode?: string;
  isLoading: boolean;
  rows: WordItem[];
  history: WordItem[];
  index: number;
}
