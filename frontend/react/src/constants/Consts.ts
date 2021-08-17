// API DOMAIN
export const API_URL = process.env.API_URL as string;
export const API_NAME = 'api';

// サーバー
export const SERVER_START_URL = () => '/admin/start';
export const SERVER_STOP_URL = () => '/admin/stop';
export const SERVER_STATUS_URL = () => '/admin/status';

export const A002_URL = () => '/v1/history';

// グループ新規作成
export const B001_URL = () => '/v1/groups';
// グループ一覧取得
export const B002_URL = () => '/v1/groups';
// グループ情報取得
export const B003_URL = (groupId: string) => `/v1/groups/${groupId}`;
// グループ情報変更
export const B004_URL = (groupId: string) => `/v1/groups/${groupId}`;
// グループ情報削除
export const B005_URL = (groupId: string) => `/v1/groups/${groupId}`;

export const C001_URL = (groupId: string) => `/v1/groups/${groupId}/words`;
export const C002_URL = (groupId: string) => `/v1/groups/${groupId}/words`;
export const C003_URL = (groupId: string, word: string) => `/v1/groups/${groupId}/words/${word}`;
export const C004_URL = (groupId: string, word: string) => `/v1/groups/${groupId}/words/${word}`;
export const C005_URL = (groupId: string, word: string) => `/v1/groups/${groupId}/words/${word}`;
export const C006_URL = (groupId: string) => `/v1/groups/${groupId}/new`;
export const C007_URL = (groupId: string) => `/v1/groups/${groupId}/test`;
export const C008_URL = (groupId: string) => `/v1/groups/${groupId}/review`;

export const D001_URL = () => '/v1/image2text';
export const D002_URL = () => '/v1/image2line';

export const E001_URL = (word: string) => `/v1/words/${word}`;
export const E002_URL = (word: string) => `/v1/words/${word}`;

export const VERSION = 'Ver0.6.2';

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
