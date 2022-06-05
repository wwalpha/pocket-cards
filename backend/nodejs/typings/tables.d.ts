export namespace Tables {
  // ------------------------------------------------------------
  // User
  // ------------------------------------------------------------
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
    email?: string;
    // TENANT_ADMIN / TENANT_USER
    role: string;
    // 保護者・利用者・管理者
    authority: string;
    //
    sub?: string;
    // 生徒一覧
    students?: string[];
    // 教師
    teacher?: string;
    // 通知先(教師のみ)
    notification?: string[];
  }

  // ------------------------------------------------------------
  // Group
  // ------------------------------------------------------------
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
    count: number;
    // index
    index?: number;
  }

  // ------------------------------------------------------------
  // Question
  // ------------------------------------------------------------
  interface TQuestionsKey {
    id: string;
  }

  interface TQuestions extends TQuestionsKey, TQuestionsGSI1Key {
    // 科目
    subject: string;
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

  // ------------------------------------------------------------
  // Learning
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Words
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Word Master
  // ------------------------------------------------------------
  export interface TWordMasterKey {
    // 単語
    id: string;
  }

  export interface TWordMaster extends TWordMasterKey {
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

  // ------------------------------------------------------------
  // Word Ignore
  // ------------------------------------------------------------
  export interface TWordIgnoreKey {
    // ユーザID
    id: string;
    // 単語
    word: string;
  }

  export interface TWordIgnore extends TWordIgnoreKey {}

  // ------------------------------------------------------------
  // Trace
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Settings
  // ------------------------------------------------------------
  interface TSettingsKey {
    // ID
    id: string;
  }

  interface TSettingsCognito extends TSettingsKey {
    userPoolId: string;
    clientId: string;
    identityPoolId: string;
  }

  // ------------------------------------------------------------
  // Curriculums
  // ------------------------------------------------------------
  interface TCurriculumsKey {
    id: string;
  }

  interface TCurriculums extends TCurriculumsKey {
    guardian: string;
    userId: string;
    groupId: string;
    subject: string;
    order: number;
    unlearned: number;
  }

  interface TCurriculumsGSI1Key {
    userId: string;
    groupId: string;
  }

  // ------------------------------------------------------------
  // Reports
  // ------------------------------------------------------------
  interface TReportsKey {
    // ID
    userId: string;
    // Timestamp
    typeDate: string;
  }

  interface TReports extends TReportsKey, DailyProgressReport {
    times?: OverallTimesReport[];
  }

  interface DailyProgressReport {
    japanese?: number;
    science?: number;
    society?: number;
  }

  interface OverallTimesReport {
    times: number;
    japanese?: number;
    science?: number;
    society?: number;
  }

  // ------------------------------------------------------------
  // Weekly Test
  // ------------------------------------------------------------
  interface TWeeklyTestKey {
    // UserId
    userId: string;
    // Subject_Qid
    subjectQid: string;
  }

  interface TWeeklyTest extends TWeeklyTestKey {
    times: number;
  }

  // ------------------------------------------------------------
  // Weekly Ability
  // ------------------------------------------------------------
  interface TWeeklyAbilityKey {
    // id
    id: string;
    // qid
    qid: string;
  }

  interface TWeeklyAbility extends TWeeklyAbilityKey {
    // 科目
    subject: string;
    // ユーザ
    userId: string;
    // 回数
    times: number;
  }
}
