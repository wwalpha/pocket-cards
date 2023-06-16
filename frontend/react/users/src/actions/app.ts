import { push } from 'connected-react-router';
import { Consts, ROUTE_PATHS } from '@constants';
import { API, Credentials } from '@utils';
import { Actions } from '@reducers';
import { AppDispatch } from '@store';

/** サーバー開始 */
export const start = () => async (dispatch: AppDispatch) => {
  const res = await API.post(Consts.SERVER_START_URL());

  dispatch(Actions.SERVER_STATUS(res.status));
};

/** サーバー停止 */
export const stop = () => async (dispatch: AppDispatch) => {
  // サーバ停止
  const res = await API.post(Consts.SERVER_STOP_URL());

  dispatch(Actions.SERVER_STATUS(res.status));
};

/** サーバーステータス */
export const status = () => async (dispatch: AppDispatch) => {
  // サーバ停止
  const res = await API.get(Consts.SERVER_STATUS_URL());
  // update server status
  dispatch(Actions.SERVER_STATUS(res.status));
};

/** タブ変更 */
export const activeTab = (index: number) => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_TAB_INDEX(index));
};

/** close snackbar */
export const closeSnackbar = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_CLOSE_SNACKBAR());
};

/** show success snackbar */
export const showSuccess = (text: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_SUCCESS(text));
};

/** show success snackbar */
export const showError = (text: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_ERROR(text));
};

/** ログアウト */
export const logout = () => (dispatch: AppDispatch) => {
  // clean credentials
  Credentials.clean();

  dispatch(Actions.APP_LOGOUT());

  dispatch(push(ROUTE_PATHS.SIGN_IN));
};

/** 通報 */
export const inquiry = (qid: string) => async (dispatch: AppDispatch) => {
  // 学習初期化
  dispatch(Actions.APP_INQUIRY(qid));
};
