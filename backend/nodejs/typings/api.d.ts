import { Tables } from '../core/typings/index';
import { Request } from 'express';

// ------------------------------------------------------------
// APIs
// ------------------------------------------------------------
export namespace APIs {
  interface BaseResponse {
    statusCode: number;
    headers?: Record<string, string>;
    isBase64Encoded: boolean;
    body?: string;
  }

  type Callback = (req: Request) => Promise<any>;

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

  // ------------------------------------------------------------
  // A002
  // ------------------------------------------------------------
  interface A002Request {}

  interface A002Response {
    remaining: {
      test: number;
      review: number;
    };
    daily: {
      total: number;
      new: number;
      review: number;
    };
    weekly: number;
    monthly: number;
  }

  // ------------------------------------------------------------
  // B001
  // ------------------------------------------------------------
  interface B001Request {
    name: string;
    subject: string;
    description?: string;
  }

  interface B001Response {
    groupId: string;
  }

  // ------------------------------------------------------------
  // B002
  // ------------------------------------------------------------
  interface B002Request {}

  interface B002Response {
    count: number;
    items: Tables.TGroups[];
  }

  // ------------------------------------------------------------
  // B003
  // ------------------------------------------------------------
  interface B003Params {
    groupId: string;
  }

  interface B003Request {}

  interface B003Response {
    item?: Tables.TGroups;
  }

  // ------------------------------------------------------------
  // B004
  // ------------------------------------------------------------
  interface B004Params {
    groupId: string;
  }

  interface B004Request {
    name?: string;
    description?: string;
  }

  // ------------------------------------------------------------
  // B005
  // ------------------------------------------------------------
  interface B005Params {
    groupId: string;
  }

  // ------------------------------------------------------------
  // B006
  // ------------------------------------------------------------
  interface B006Params {
    groupId: string;
  }

  interface B006Request {}

  interface B006Response {
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

  // ------------------------------------------------------------
  // C001
  // ------------------------------------------------------------
  interface C001Params {
    groupId: string;
  }

  interface C001Request {
    words: string[];
  }

  interface C001Response {}

  // ------------------------------------------------------------
  // C002
  // ------------------------------------------------------------
  interface C002Params {
    groupId: string;
  }

  interface C002ResItem {
    id: string;
    vocabulary?: string;
  }

  interface C002Response {
    count: number;
    items: C002ResItem[];
  }

  // ------------------------------------------------------------
  // C003
  // ------------------------------------------------------------
  interface C003Params {
    groupId: string;
    word: string;
  }

  interface C003Response {
    item?: Tables.TWords;
  }

  // ------------------------------------------------------------
  // C004
  // ------------------------------------------------------------
  interface C004Params {
    groupId: string;
    word: string;
  }

  interface C004Request {
    type: string;
    correct?: boolean;
    times?: number;
    newWord?: string;
  }

  type C004Response = void;

  // ------------------------------------------------------------
  // C005
  // ------------------------------------------------------------
  interface C005Params {
    groupId: string;
    word: string;
  }

  type C005Response = void;

  // ------------------------------------------------------------
  // C006
  // ------------------------------------------------------------
  interface C006Params {
    groupId: string;
  }

  interface C006Response {
    count: number;
    words: WordItem[];
  }
  // ------------------------------------------------------------
  // C007
  // ------------------------------------------------------------
  interface C007Params {
    groupId: string;
  }

  interface C007Response {
    count: number;
    words: WordItem[];
  }
  // ------------------------------------------------------------
  // C008
  // ------------------------------------------------------------
  interface C008Params {
    groupId: string;
  }

  interface C008Response {
    count: number;
    words: WordItem[];
  }
  // ------------------------------------------------------------
  // D001
  // ------------------------------------------------------------
  interface D001Request {
    content: string;
    language?: string;
  }

  interface D001Response {
    count: number;
    words: string[];
  }

  // ------------------------------------------------------------
  // D003
  // ------------------------------------------------------------
  interface D003Request {
    word: string;
  }

  type D003Response = void;

  // ------------------------------------------------------------
  // D004
  // ------------------------------------------------------------
  interface D004Request {}

  type D004Response = {
    count: number;
    words: WordItem[];
  };

  // ------------------------------------------------------------
  // D005
  // ------------------------------------------------------------
  interface D005Request {}

  type D005Response = {
    count: number;
    words: WordItem[];
  };

  // ------------------------------------------------------------
  // D006
  // ------------------------------------------------------------
  interface D006Request {}

  type D006Response = {
    count: number;
    words: WordItem[];
  };

  // ------------------------------------------------------------
  // E001
  // ------------------------------------------------------------
  interface E001Params {
    word: string;
  }

  interface E001Response {
    item?: Tables.TWordMaster;
  }

  // ------------------------------------------------------------
  // E002
  // ------------------------------------------------------------
  interface E002Params {
    word: string;
  }

  interface E002Request extends Tables.TWordMaster {}

  type E002Response = Tables.TWordMaster;

  // ------------------------------------------------------------
  // Question
  // ------------------------------------------------------------
  interface QuestionRegistParams {
    groupId: string;
  }

  interface QuestionRegistRequest {
    questions: string[];
  }

  interface QuestionRegistResponse {}

  // Study
  interface QuestionStudyRequest {}

  interface QuestionStudyResponse {
    count: number;
    questions: Tables.TQuestion[];
  }

  interface QuestionStudyQuery {
    subject?: string;
  }

  // Test
  interface QuestionTestRequest {}

  interface QuestionTestResponse {
    count: number;
    questions: Tables.TQuestion[];
  }

  // ------------------------------------------------------------
  // Question Answer
  // ------------------------------------------------------------
  interface QuestionAnswerParams {
    groupId: string;
    questionId: string;
  }

  interface QuestionAnswerRequest {
    correct?: boolean;
  }

  type QuestionAnswerResponse = void;
}
