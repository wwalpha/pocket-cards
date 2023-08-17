import { Tables } from './tables';
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
  interface GroupRegistRequest {
    name: string;
    subject: string;
    grade: string;
    description?: string;
  }

  interface GroupRegistResponse {
    groupId: string;
  }

  // ------------------------------------------------------------
  // B002
  // ------------------------------------------------------------
  interface GroupListQuery {
    subject?: string;
  }

  interface GroupListRequest {}

  interface GroupListResponse {
    count: number;
    items: Tables.TGroups[];
  }

  // ------------------------------------------------------------
  // B003
  // ------------------------------------------------------------
  interface GroupDescribeParams {
    groupId: string;
  }

  interface GroupDescribeRequest {}

  interface GroupDescribeResponse {
    item?: Tables.TGroups;
  }

  // ------------------------------------------------------------
  // B004
  // ------------------------------------------------------------
  interface GroupUpdateParams {
    groupId: string;
  }

  interface GroupUpdateRequest {
    grade: string;
    name?: string;
    description?: string;
  }

  // ------------------------------------------------------------
  // Group Remove
  // ------------------------------------------------------------
  interface GroupRemoveParams {
    groupId: string;
  }

  type GroupRemoveResponse = void;

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
  // Question Regist
  // ------------------------------------------------------------
  interface QuestionRegistParams {
    groupId: string;
  }

  interface QuestionRegistRequest {
    questions: string[];
  }

  interface QuestionRegistResponse {
    count: number;
    ids: string[];
  }

  // ------------------------------------------------------------
  // Question Delete
  // ------------------------------------------------------------
  interface QuestionDeleteParams {
    groupId: string;
    questionId: string;
  }

  interface QuestionDeleteRequest {}

  type QuestionDeleteResponse = void;

  // ------------------------------------------------------------
  // Question Daily Study
  // ------------------------------------------------------------
  interface QuestionStudyRequest {}

  interface DailyPracticeResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  interface DailyPracticeRequest {
    subject: string;
  }

  // ------------------------------------------------------------
  // Daily Exam
  // ------------------------------------------------------------
  interface DailyExamRequest {
    subject: string;
    userId?: string;
    selftest?: string;
  }

  interface DailyExamResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Daily Review
  // ------------------------------------------------------------
  interface DailyReviewRequest {
    subject?: string;
    userId?: string;
  }

  interface DailyReviewResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Question Answer
  // ------------------------------------------------------------
  interface QuestionAnswerRequest {
    qid: string;
    correct: string;
    selftest?: string;
  }

  type QuestionAnswerResponse = void;

  // ------------------------------------------------------------
  // Question List
  // ------------------------------------------------------------
  interface QuestionListParams {
    groupId: string;
  }

  interface QuestionListRequest {}

  interface QuestionListResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Question Order
  // ------------------------------------------------------------
  interface QuestionOrderQuery {
    subject?: string;
  }

  interface QuestionOrderRequest {}

  interface QuestionOrderResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Question Describe
  // ------------------------------------------------------------
  interface QuestionDescribeParams {
    groupId: string;
    questionId: string;
  }

  interface QuestionDescribeRequest {}

  interface QuestionDescribeResponse {
    question: Tables.TQuestions;
  }

  // ------------------------------------------------------------
  // Question Update
  // ------------------------------------------------------------
  interface QuestionUpdateParams {
    groupId: string;
    questionId: string;
  }

  interface QuestionUpdateRequest {
    title: string;
    choices?: string;
    answer: string;
    description?: string;
    category: string;
    tags?: string[];
    qNo?: string;
    difficulty?: string;
  }

  type QuestionUpdateResponse = Tables.TQuestions;

  // ------------------------------------------------------------
  // Question Ignore
  // ------------------------------------------------------------
  interface QuestionIgnoreParams {
    groupId: string;
  }

  interface QuestionIgnoreRequest {
    qid: string;
  }

  type QuestionIgnoreResponse = void;

  // ------------------------------------------------------------
  // Question Transfer
  // ------------------------------------------------------------
  interface QuestionTransferParams {
    groupId: string;
    questionId: string;
  }

  interface QuestionTransferRequest {
    newGroupId: string;
  }

  type QuestionTransferResponse = void;

  // ------------------------------------------------------------
  // Curriculum Ignore
  // ------------------------------------------------------------
  interface CurriculumIgnoreParams {
    curriculumId: string;
    questionId: string;
  }

  interface CurriculumIgnoreRequest {}

  type CurriculumIgnoreResponse = void;

  // ------------------------------------------------------------
  // Weekly Regist
  // ------------------------------------------------------------
  interface WeeklyRegistRequest {
    groupIds: string[];
    student: string;
  }

  type WeeklyRegistResponse = void;

  // ------------------------------------------------------------
  // Weekly List
  // ------------------------------------------------------------
  interface WeeklyListQuery {
    subject: string;
  }

  interface WeeklyListRequest {}

  interface WeeklyListResponse {
    count: number;
    questions: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Weekly Answer
  // ------------------------------------------------------------
  interface WeeklyAnswerParameter {
    questionId: string;
  }

  interface WeeklyAnswerRequest {
    correct?: string;
  }

  type WeeklyAnswerResponse = void;
  // ------------------------------------------------------------
  // Reports - Daily Tasks
  // ------------------------------------------------------------
  interface DailyTasksResquest {}

  interface DailyTasksResponse {
    language: {
      archive: number;
      target: number;
    };
    society: {
      archive: number;
      target: number;
    };
    science: {
      archive: number;
      target: number;
    };
  }

  // ------------------------------------------------------------
  // Reports - Daily Status
  // ------------------------------------------------------------
  interface DailyStatusResquest {}

  interface DailyStatusQuery {
    datetime: string;
    groupId: string;
    userId: string;
  }

  type DailyStatusResponseItem = {
    // question id
    qid: string;
    // 問題
    title: string;
    // 学習回数(解答前)
    before: number;
    // 学習回数(解答後)
    after: number;
  };

  interface DailyStatusResponse {
    items: DailyStatusResponseItem[];
  }

  // ------------------------------------------------------------
  // Reports - Overall Status
  // ------------------------------------------------------------
  interface OverallStatusResquest {}

  interface OverallStatusQuery {
    userId: string;
    groupId: string;
  }

  type OverallStatusResponseItem = {
    // question id
    qid: string;
    // 回答回数
    times: number;
    // 問題
    title: string;
  };

  interface OverallStatusResponse {
    items: OverallStatusResponseItem[];
  }

  // ------------------------------------------------------------
  // Reports - Leaning Progress
  // ------------------------------------------------------------
  interface LearningProgressRequest {}

  interface LearningProgressResponse {
    histories: {
      timestamp: string;
      japanese?: number;
      science?: number;
      society?: number;
    }[];
  }

  // ------------------------------------------------------------
  // Reports - Leaning Overall
  // ------------------------------------------------------------
  interface LearningOverallRequest {}

  interface LearningOverallResponse {
    language: _.Dictionary<number>;
    science: _.Dictionary<number>;
    society: _.Dictionary<number>;
    maths: _.Dictionary<number>;
  }

  // ------------------------------------------------------------
  // Reports - Inquiry Regist
  // ------------------------------------------------------------
  interface InquiryRegistResquest {
    id: string;
  }

  type InquiryRegistResponse = void;

  // ------------------------------------------------------------
  // Reports - Inquiry Remove
  // ------------------------------------------------------------
  interface InquiryRemoveParameter {
    id: string;
  }

  type InquiryRemoveResquest = void;

  type InquiryRemoveResponse = void;

  // ------------------------------------------------------------
  // Reports - Inquiry List
  // ------------------------------------------------------------
  interface InquiryListResquest {}

  interface InquiryListResponse {
    items: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Reports - Daily Test Question list
  // ------------------------------------------------------------
  interface DailyTestQuestionsRequest {
    uid: string;
    subject: string;
  }

  interface DailyTestQuestionsResponse {
    qid: string[];
  }

  // ------------------------------------------------------------
  // Curriculums - Curriculum Overall
  // ------------------------------------------------------------
  interface CurriculumOverallResquest {
    curriculums: string[];
  }

  type CurriculumOverallResponseItem = {
    // group id
    id: string;
    // 問題
    progress: number[];
  };

  interface CurriculumOverallResponse {
    items: CurriculumOverallResponseItem[];
  }

  // ------------------------------------------------------------
  // Curriculums - Curriculum Regist
  // ------------------------------------------------------------
  interface CurriculumRegistRequest {
    userId: string;
    groupId: string;
  }

  type CurriculumRegistResponse = Tables.TCurriculums;

  // ------------------------------------------------------------
  // Curriculums - Curriculum Describe
  // ------------------------------------------------------------
  interface CurriculumDescribeRequest {}

  interface CurriculumDescribeResponse {}

  // ------------------------------------------------------------
  // Curriculums - Curriculum Remove
  // ------------------------------------------------------------
  interface CurriculumRemoveParams {
    curriculumId: string;
  }

  type CurriculumRemoveRequest = void;

  type CurriculumRemoveResponse = void;

  // ------------------------------------------------------------
  // Curriculums - Curriculum Order Update
  // ------------------------------------------------------------
  interface CurriculumOrderParams {
    curriculumId: string;
  }

  interface CurriculumOrderRequest {
    order: string;
  }

  type CurriculumOrderResponse = Tables.TCurriculums;

  // ------------------------------------------------------------
  // Curriculums - Curriculum Lists
  // ------------------------------------------------------------
  interface CurriculumListsQuery {
    subject?: string;
  }

  interface CurriculumListsRequest {}

  interface CurriculumListsResponse {
    count: number;
    items: Tables.TCurriculums[];
  }

  interface CurriculumQuestionsParams {
    curriculumId: string;
  }

  interface CurriculumQuestionsRequest {}

  interface CurriculumQuestionsResponse {
    count: number;
    items: Tables.TQuestions[];
  }

  // ------------------------------------------------------------
  // Vision - Handwriting
  // ------------------------------------------------------------
  interface HandwritingRequest {
    key: string;
  }

  interface HandwritingResponse {
    results: string[];
  }

  // ------------------------------------------------------------
  // Vision - Image2Text
  // ------------------------------------------------------------
  interface Image2TextRequest {
    key: string;
  }

  interface Image2TextResponse {
    results: string[];
  }

  // ------------------------------------------------------------
  // Curriculum's learning status
  // ------------------------------------------------------------
  interface CurriculumStatusRequest {
    curriculums: string[];
    unlearned?: string;
    startDate?: string;
    endDate?: string;
  }

  type CurriculumStatusResponseItem = Tables.TLearning & {
    question?: string;
    gid?: string;
    accuracy?: number;
  };

  interface CurriculumStatusResponse {
    count: number;
    items: CurriculumStatusResponseItem[];
  }

  // ------------------------------------------------------------
  // Learning Describe (GET)
  // ------------------------------------------------------------
  interface LearningDescribeRequest {}

  interface LearningDescribeParams {
    qid: string;
  }

  interface LearningDescribeQuery {
    uid: string;
  }

  type LearningDescribeResponse = Tables.TLearning;
}
