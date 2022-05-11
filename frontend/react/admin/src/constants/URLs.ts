export const API_URL = process.env.API_URL as string;
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

// カリキュラム一覧取得
export const CURRICULUM_LIST = () => `${API_VERSION}/curriculums`;
// カリキュラムの登録
export const CURRICULUM_REGIST = () => `${API_VERSION}/curriculums`;
// カリキュラムの削除
export const CURRICULUM_REMOVE = (curriculumId: string) => `${API_VERSION}/curriculums/${curriculumId}`;

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
