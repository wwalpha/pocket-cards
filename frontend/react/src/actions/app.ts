import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { API, Credentials } from '@utils';
import { Actions } from '@reducers';
import { AppDispatch } from '@store';

/** サーバー開始 */
export const start = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      const res = await API.post(Consts.SERVER_START_URL());

      dispatch(Actions.SERVER_STATUS(res.status));
    })
  );

/** サーバー停止 */
export const stop = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // サーバ停止
      const res = await API.post(Consts.SERVER_STOP_URL());

      dispatch(Actions.SERVER_STATUS(res.status));
    })
  );

/** サーバーステータス */
export const status = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // サーバ停止
      const res = await API.get(Consts.SERVER_STATUS_URL());
      // update server status
      dispatch(Actions.SERVER_STATUS(res.status));
      // get group list
      if (res.status === Consts.SERVER_STATUS.RUNNING) {
        dispatch(Actions.GROUP_LIST());
      }
    })
  );

/** グループ選択 */
export const activeGroup = (groupId: string) => async (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // set selected group
      dispatch(Actions.GROUP_ACTIVE(groupId));

      dispatch(Actions.GROUP_WORD_LIST(groupId));
    })
  );

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

export const showUserRegist = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_USER_REGIST(true));
};

export const hideUserRegist = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_USER_REGIST(false));
};

/** ログアウト */
export const logout = () => (dispatch: AppDispatch) => {
  // clean credentials
  Credentials.clean();

  dispatch(Actions.APP_LOGOUT());

  dispatch(push(Paths.PATHS_SIGN_IN));
};
