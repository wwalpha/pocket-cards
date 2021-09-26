// API DOMAIN
export const API_URL = process.env.API_URL as string;
export const API_NAME = 'api';
export const API_VERSION = '/v1';

// サーバー
export const SERVER_START_URL = () => '/admin/start';
export const SERVER_STOP_URL = () => '/admin/stop';
export const SERVER_STATUS_URL = () => '/admin/status';

export const A002_URL = () => `${API_VERSION}/history`;

// グループ新規作成
export const B001_URL = () => `${API_VERSION}/groups`;
// グループ一覧取得
export const B002_URL = () => `${API_VERSION}/groups`;
// グループ情報取得
export const B003_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}`;
// グループ情報変更
export const B004_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}`;
// グループ情報削除
export const B005_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}`;
// グループ学習状態
export const B006_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/status`;

// 単語一括登録
export const C001_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/words`;
export const C002_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/words`;
export const C003_URL = (groupId: string, word: string) => `${API_VERSION}/groups/${groupId}/words/${word}`;
export const C004_URL = (groupId: string, word: string) => `${API_VERSION}/groups/${groupId}/words/${word}`;
export const C005_URL = (groupId: string, word: string) => `${API_VERSION}/groups/${groupId}/words/${word}`;
export const C006_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/new`;
export const C007_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/test`;
export const C008_URL = (groupId: string) => `${API_VERSION}/groups/${groupId}/review`;

export const D001_URL = () => `${API_VERSION}/image2text`;
export const D002_URL = () => `${API_VERSION}/image2line`;
export const D003_URL = () => `${API_VERSION}/user/wordignore`;

export const E001_URL = (word: string) => `${API_VERSION}/words/${word}`;
export const E002_URL = (word: string) => `${API_VERSION}/words/${word}`;

export const VERSION = `${process.env.VERSION}`;

export const MODES = {
  New: '1',
  AllTest: '3',
  Review: '4',
};

export const PAGE_MAX_WORDS = 7;

export const SERVER_STATUS = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  PROVISIONING: 'PROVISIONING',
  ACTIVATING: 'ACTIVATING',
  PENDING: 'PENDING',
  STOPPING: 'STOPPING',
};

export const HEADER_HEIGHT = 64;
export const FOOT_HEIGHT = 72;

export enum ShowTypes {
  REMOVE_WORD,
}

export const STUDY_BUFFER_LOWER_LIMIT = 5;
