import { CognitoUser } from '@aws-amplify/auth';
import { Group } from '@domains';
import { APIs, ReduxAction0, ReduxAction2, ReduxAction3, ReduxAction1, App, Tables } from '.';

/** 画像アップロード */
export interface ImageUploadPayload {
  data: APIs.D001Response;
}

export type ImageUploadAction = ReduxAction1<string, ImageUploadPayload>;

/** ファイルアップロード */
export interface FileUploadPayload {
  words: string[];
}

export type FileUploadAction = ReduxAction1<string, FileUploadPayload>;

/** 指定単語削除 */
export interface RegistRemovePayload {
  word: string;
}

export type RemoveWordAction = ReduxAction1<string, RegistRemovePayload>;

/** 単語登録 */
export type RegistWordsAction = ReduxAction1<string[], void, Promise<void>>;

/** 単語クリア */
export type ClearAction = ReduxAction0<void>;

// ######################################################################
// APP Actions
// ######################################################################
/** Start/End Loading */
export interface LoadingPayload {
  isLoading: boolean;
}

export type LoadingAction = ReduxAction1<boolean, LoadingPayload>;

/** Tab Change */
export interface TabChangePayload {
  index: number;
}

export type TabChangeAction = ReduxAction1<number, TabChangePayload>;

/** ログイン状態変更 */
export interface LoggedInPayload {
  user: CognitoUser;
}
export type LoggedInAction = ReduxAction1<CognitoUser, LoggedInPayload>;

/** ログアウト */
export type LogoutAction = ReduxAction0;

/** サーバ開始 */
export interface ServerStartPayload {
  status: string;
}

export type ServerStartAction = ReduxAction0<ServerStartPayload>;

/** サーバ終了 */
export interface ServerStopPayload {
  status: string;
}

export type ServerStopAction = ReduxAction0<ServerStopPayload>;

/** サーバステータス */
export interface ServerStatusPayload {
  status: string;
}

export type ServerStatusAction = ReduxAction0<ServerStatusPayload>;

/** グループ選択 */
export interface GroupSelectPayload {
  groupId: string;
}

export type GroupSelectAction = ReduxAction1<string, GroupSelectPayload>;

/** 表示フラグ制御 */
export interface App10Payload {
  type: number;
  value: boolean;
}

export type ShowAction = ReduxAction2<number, boolean, App10Payload>;

// ######################################################################
// Group Actions
// ######################################################################

/** Group Regist */
export type GroupRegistPayload = Tables.TGroups;
export type GroupRegistAction = ReduxAction2<string, string | undefined, GroupRegistPayload>;

/** Group List */
export type GroupListPayload = APIs.B002Response;
export type GroupListAction = ReduxAction0<GroupListPayload>;

/** Group Delete */
export type GroupDeletePayload = {
  groupId: string;
};
export type GroupDeleteAction = ReduxAction0<GroupDeletePayload>;

/** Group Edit */
export type GroupEditPayload = void;
export type GroupEditAction = ReduxAction1<App.GroupInfo, GroupEditPayload>;

/** Group Words */
export type GroupWordsPayload = {
  groupId: string;
  datas: APIs.C002Response;
};
export type GroupWordsAction = ReduxAction1<string, GroupWordsPayload>;

// ######################################################################
// Word Actions
// ######################################################################

/** Word List */
export type E005Payload = {
  groupId: string;
  words: APIs.C002Response;
};

export type WordListAction = ReduxAction1<string, E005Payload, Promise<void>>;

/** Word Details */
export type WordDetailPayload = {
  datas: App.WordDetail;
};

export type WordDetailAction = ReduxAction1<string, WordDetailPayload, Promise<void>>;

export type WordDeletePayload = {
  groupId: string;
  word: string;
};

export type WordDeleteAction = ReduxAction2<string, string, WordDeletePayload, Promise<void>>;

export interface StudyPayload {
  mode: string;
  datas: APIs.C006Response;
}

export type StudyNewAction = ReduxAction0<StudyPayload>;

export type StudyReviewAction = ReduxAction0<StudyPayload, Promise<void>>;

export type StudyTestAction = ReduxAction0<StudyPayload>;

export interface StudyAnswerPayload {
  yes: boolean;
}

export type StudyAnswerAction = ReduxAction2<string, boolean, StudyAnswerPayload | StudyPayload, Promise<void>>;
