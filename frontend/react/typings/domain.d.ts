import { CognitoUser } from '@aws-amplify/auth';
import { E001Response } from './api';
import { GroupInfo, GroupWordsItem } from './types';

export interface AppState {
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
