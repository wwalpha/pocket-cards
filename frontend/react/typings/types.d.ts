declare module '*.svg' {
  const content: string;
  export default content;
}

export namespace Payloads {
  type StudyCase = {
    mode: string;
    items: Group.WordItem[];
  };

  type GroupWordList = {
    id: string;
    items: Group.WordDetails[];
  };

  type GroupWordDetails = Group.WordDetails;

  type RemoveWordInGroup = {
    id: string;
    word: string;
  };
}

export namespace App {
  export type PathInfo = Record<string, ScreenInfo>;
}

export namespace User {
  interface Details {
    username: string;
  }
}

export namespace Group {
  interface Details {
    id: string;
    name: string;
    description?: string;
  }

  type GroupWords = Record<string, WordDetails[]>;

  interface WordDetails {
    id: string;
    pronounce?: string;
    vocabulary?: string;
    mp3?: string;
    vocChn?: string;
    vocJpn?: string;
  }

  interface WordItem {
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
}

interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}
