import { Credentials } from '@utils';

export const API_URL = process.env.API_URL as string;
export const WSS_URL = process.env.WSS_URL as string;

export const API_NAME = 'api';
export const API_VERSION = '/v1';

export const SIGN_IN = () => `${API_VERSION}/auth/login`;
export const SIGN_UP = () => `${API_VERSION}/users`;
export const REFRESH_TOKEN = () => `${API_VERSION}/auth/refresh`;

// グループ一覧取得
export const GroupList = () => `${API_VERSION}/groups`;
// グループ情報登録
export const GroupRegist = () => `${API_VERSION}/groups`;
// グループ情報変更
export const GROUP_UPDATE = (groupId: string) => `${API_VERSION}/groups/${groupId}`;
// グループ情報削除
export const GROUP_REMOVE = (groupId: string) => `${API_VERSION}/groups/${groupId}`;

// 問題集一覧取得
export const QUESTION_LIST = (groupId: string) => `${API_VERSION}/groups/${groupId}/questions`;
// 問題集一括登録
export const QUESTION_REGIST = (groupId: string) => `${API_VERSION}/groups/${groupId}/questions`;
// 問題集情報更新
export const QUESTION_UPDATE = (groupId: string, questionId: string) =>
  `${API_VERSION}/groups/${groupId}/questions/${questionId}`;
export const QUESTION_DELETE = (groupId: string, questionId: string) =>
  `${API_VERSION}/groups/${groupId}/questions/${questionId}`;
export const QUESTION_IGNORE = (groupId: string) => `${API_VERSION}/groups/${groupId}/questions/ignore`;

// カリキュラム一覧取得
export const CURRICULUM_LIST = () => `${API_VERSION}/curriculums`;
// カリキュラムの登録
export const CURRICULUM_REGIST = () => `${API_VERSION}/curriculums`;
// カリキュラムの削除
export const CURRICULUM_REMOVE = (curriculumId: string) => `${API_VERSION}/curriculums/${curriculumId}`;
// カリキュラムの並べ順の更新
export const CURRICULUM_ORDER = (curriculumId: string) => `${API_VERSION}/curriculums/${curriculumId}/order`;

// カリキュラムの並べ順の更新
export const DAILY_TEST = (subject: string, userId: string) =>
  `${API_VERSION}/study/daily/test/questions?subject=${subject}&userId=${userId}`;

// 生徒登録
export const STUDENT_REGIST = () => `${API_VERSION}/users/students`;
// 生徒一覧
export const STUDENT_LIST = () => `${API_VERSION}/users/students`;

// 保護者情報取得
export const DESCRIBE_USER = (userId: string) => `${API_VERSION}/users/${userId}`;
// 保護者情報更新
export const UPDATE_USER = (userId: string) => `${API_VERSION}/users/${userId}`;

// 問題集情報更新
export const STUDY_WEEKLY_REGIST = () => `${API_VERSION}/study/weekly`;

export const WEBSOCKET_URL = async () => {
  const idToken = (await Credentials.getSession())?.idToken;

  if (idToken) {
    return `${WSS_URL}?Authorization=${idToken}`;
  }

  return WSS_URL;
};

// 問い合わせ一覧
export const INQUIRY_LIST = () => `${API_VERSION}/inquiries`;

export const INQUIRY_REMOVE = (qid: string) => `${API_VERSION}/inquiries/${qid}`;

// 日次テスト問題一覧
export const REPORTS_DAILY_TEST = () => `${API_VERSION}/reports/questions/dailytest`;

export const LEARNING_GET = (qid: string, uid: string) => `${API_VERSION}/study/learning/${qid}?uid=${uid}`;
