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

export interface WordItem {
  // 単語
  word: string;
  // 発音記号
  pronounce?: string;
  // 語彙（中国語）
  vocChn?: string;
  // 語彙（日本語）
  vocJpn?: string;
  // 音声ファイル
  mp3?: string;
  // 回数
  times: number;
}

/** URL path informations */
export type PathInfo = Record<string, ScreenInfo>;

export interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}
