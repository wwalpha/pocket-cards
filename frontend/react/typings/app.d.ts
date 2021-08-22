import { APIs } from '.';

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

/** group datarow item */
interface GroupItem {
  word: string;
  vocabulary?: string;
}

/** group words list */
export type GroupWords = Record<string, GroupItem[]>;

export type PathInfo = Record<string, ScreenInfo>;

export interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}
