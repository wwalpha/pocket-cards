import { APIs } from '.';

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

export interface GroupWordsItem {
  groupId: string;
  words: APIs.C002Response;
}

export type PathInfo = { [key: string]: ScreenInfo };

export interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}
