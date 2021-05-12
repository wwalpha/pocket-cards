import { Action, ActionFunction0, ActionFunction1, ActionFunction2 } from 'redux-actions';
import { CallHistoryMethodAction } from 'connected-react-router';
import { ThunkAction } from 'redux-thunk';
import { APIClass } from './api';
import { State } from './domain';

// ######################################################################
// Commons
// ######################################################################
export type ThunkActions<S = any, R> = ThunkAction<
  R,
  State,
  APIClass,
  Action<S | ErrorPayload> | CallHistoryMethodAction
>;

export type ReduxAction0<S = any, R = void> = ActionFunction0<ThunkActions<S, R>>;

export type ReduxAction1<P, S = any, R = void> = ActionFunction1<P, ThunkActions<S, R>>;

export type ReduxAction2<P1, P2, S = any, R = void> = ActionFunction2<P1, P2, ThunkActions<S, R>>;

/** Actions */
export type RequestAction = ActionFunction0<Action<any>>;
export type FailureAction = ActionFunction1<Error, Action<ErrorPayload>>;

export interface SuccessAction2<T, P> {
  type: T;
  payload: P;
}

export interface ErrorPayload {
  error: Error;
}

// ######################################################################
// A01 Actions
// ######################################################################
/** 画像アップロード */
export interface A001Payload {
  data: API.D001Response;
}

export type UploadImageAction = ReduxAction1<string, A001Payload>;

/** 指定単語削除 */
export interface A002Payload {
  word: string;
}

export type RemoveWordAction = ReduxAction1<string, A002Payload>;

/** 単語登録 */
export type RegistWordsAction = ReduxAction1<string[], any, Promise<void>>;

/** 単語クリア */
export type ClearAction = ReduxAction0<any>;

// ######################################################################
// APP Actions
// ######################################################################

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
export interface App09Payload {
  groupId: string;
}

export type GroupSelectAction = ReduxAction1<string, App09Payload>;

/** 表示フラグ制御 */
export interface App10Payload {
  type: number;
  value: boolean;
}

export type ShowAction = ReduxAction2<number, boolean, App10Payload>;

// ######################################################################
// Group Actions
// ######################################################################

/** Group List */
export type E001Payload = API.B002Response;
export type GroupListAction = ReduxAction0<E001Payload>;

/** Group Regist */
export type E002Payload = Common.GroupInfo;
export type GroupRegistAction = ReduxAction2<string, string, E002Payload>;

/** Group Edit */
export type E003Payload = void;
export type GroupEditAction = ReduxAction1<Common.GroupInfo, E003Payload>;

/** Group Delete */
export type E004Payload = {
  groupId: string;
};

export type GroupDeleteAction = ReduxAction0<E004Payload>;

// ######################################################################
// Word Actions
// ######################################################################

/** Word List */
export type E005Payload = {
  groupId: string;
  words: API.C002Response;
};

export type WordListAction = ReduxAction1<string, E005Payload, Promise<void>>;

/** Word Details */
export type E006Payload = {
  res: API.E001Response;
};

export type WordDetailAction = ReduxAction1<string, E006Payload, Promise<void>>;

/** Word Delete */
export type E008Payload = {
  groupId: string;
  word: string;
};

export type WordDeleteAction = ReduxAction2<string, string, E008Payload, Promise<void>>;

export interface B001Payload {
  mode: string;
  words: WordItem[];
}

export type StartNewAction = ReduxAction0<B001Payload>;

export interface B004Payload {
  yes: boolean;
}

export type AnswerAction = ReduxAction2<string, boolean, B004Payload, Promise<void>> | ReduxAction0<B001Payload>;

export interface B006Payload {
  mode: string;
  words: WordItem[];
}
export type StartReviewAction = ReduxAction0<B006Payload, Promise<void>>;

export interface B007Payload {
  mode: string;
  words: WordItem[];
}

export type StartTestAction = ReduxAction0<B007Payload>;
