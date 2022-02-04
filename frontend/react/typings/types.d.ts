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
    items: Group.WordSimple[];
  };

  type GroupWordDetails = Group.WordDetails;

  type GroupWordUpdate = {
    old: string;
    new: string;
    details: Group.WordDetails;
  };

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

  type GroupWords = Record<string, WordSimple[]>;

  interface WordSimple {
    id: string;
    vocabulary?: string;
  }

  interface WordDetails {
    id: string;
    original: string;
    pronounce?: string;
    vocabulary?: string;
    mp3?: string;
    vocChn?: string;
    vocJpn?: string;
  }

  interface WordItem {
    // 単語
    id: string;
    // グループID
    groupId: string;
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

  interface Status {
    // 単語数
    count: number;
    // 学習済み
    learned: number;
    // 未学習
    unlearned: number;
    // 復習
    review: number;
    // 未テスト
    untested: number;
  }
}

interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}
