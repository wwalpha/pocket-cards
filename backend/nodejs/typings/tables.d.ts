export namespace Tables {
  interface TUsersKey {
    // ユーザID
    id: string;
  }

  interface TUsers extends TUsersKey {
    // ユーザ名
    username: string;
    // ユーザ ICon
    icon?: string;
    // メール
    email: string;
    // TENANT_ADMIN / TENANT_USER
    role: string;
    // 保護者・利用者・管理者
    authority: string;
    //
    sub?: string;
    // 生徒一覧
    students?: string[];
  }

  interface TGroupsKey {
    // グループID
    id: string;
  }

  interface TGroups extends TGroupsKey {
    // 科目
    subject: string;
    // グループ名
    name?: string;
    // 説明
    description?: string;
    // 単語数
    count?: number;
    // index
    index?: number;
  }

  interface TQuestionsKey {
    id: string;
  }

  interface TQuestions extends TQuestionsKey, TQuestionsGSI1Key {
    // グループID
    groupId: string;
    // 問題
    title: string;
    // 問題の説明
    description?: string;
    // 選択肢
    choices?: string[];
    // 回答
    answer: string;
    // 問題音声
    voiceTitle?: string;
    // 回答音声
    voiceAnswer?: string;
    /** @deprecated 次の学習時間 */
    nextTime?: string;
    /** @deprecated 最後の学習時間 */
    lastTime?: string;
    /** @deprecated 学習回数 */
    times?: number;
  }

  interface TQuestionsGSI1Key {
    // グループID
    groupId: string;
    // 問題ID
    id: string;
  }

  interface TQuestionsGSI1Projection {}

  interface TLearningKey {
    // 問題ID
    qid: string;
    // ユーザID
    userId: string;
  }

  interface TLearning extends TLearningKey {
    // グループID
    groupId: string;
    // 次回の学習時間
    nextTime: string;
    // 最後の学習時間
    lastTime?: string;
    // 学習回数
    times: number;
    // 科目
    subject?: string;
  }

  interface TLearningGSI1Key {
    // ユーザID
    userId: string;
    // 次の学習時間
    nextTime: string;
  }

  interface TLearningGSI1Projection extends TLearningGSI1Key {
    // 問題ID
    qid: string;
  }

  interface TWordsKey {
    // 単語
    id: string;
    // グループID
    groupId: string;
  }

  interface TWords extends TWordsKey {
    // 次の学習時間
    nextTime: string;
    // 最後の学習時間
    lastTime?: string;
    // 学習回数
    times: number;
    // 語彙
    vocabulary?: string;
  }

  export interface TWordMaster {
    // 単語
    id: string;
    // 原型
    original: string;
    // 発音記号
    pronounce?: string;
    // 語彙（中国語）
    vocChn?: string;
    // 語彙（日本語）
    vocJpn?: string;
    // 音声ファイル
    mp3?: string;
  }

  export interface WordIgnoreKey {
    // ユーザID
    id: string;
    // 単語
    word: string;
  }

  export interface TWordIgnore extends WordIgnoreKey {}

  interface GroupsKey {
    // グループID
    id: string;
  }

  interface TracesKey {
    // 問題ID
    qid: string;
    // Timestamp
    timestamp: string;
  }

  interface TTraces extends TracesKey {
    // ユーザID
    userId?: string;
    // グループID
    groupId?: string;
    // 最後の学習時間
    lastTime?: string;
    // 学習回数(解答前)
    timesBefore?: number;
    // 学習回数(解答後)
    timesAfter?: number;
    // 科目
    subject?: string;
  }

  interface THistoriesKey {
    // ユーザID
    userId: string;
    // Timestamp
    timestamp: string;
  }

  interface THistories extends THistoriesKey {
    japanese?: number;
    science?: number;
    society?: number;
  }

  interface TSettingsKey {
    // ID
    id: string;
  }

  interface TSettingsCognito extends TSettingsKey {
    userPoolId: string;
    clientId: string;
    identityPoolId: string;
  }

  interface TCurriculumsKey {
    id: string;
  }

  interface TCurriculums extends TCurriculumsKey {
    guardian: string;
    userId: string;
    groupId: string;
  }

  interface TCurriculumsGSI1Key {
    userId: string;
    groupId: string;
  }
}
