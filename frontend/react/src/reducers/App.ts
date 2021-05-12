import { handleActions, Action } from 'redux-actions';
import { AppState } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<AppState, any>(
  {
    /** タブ変更 */
    [ActionTypes.APP_01_SUCCESS]: (store: AppState, { payload: { index } }: Action<Actions.TabChangePayload>) =>
      store.tabChange(index),

    /** ユーザ情報設定 */
    [ActionTypes.APP_04_SUCCESS]: (store: AppState, { payload }: Action<Actions.LoggedInPayload>) =>
      store.loggedIn(payload.user),

    /** ログアウト */
    [ActionTypes.APP_05_SUCCESS]: (store: AppState) => store.logout(),

    /** サーバ関連 */
    [ActionTypes.APP_06_SUCCESS]: (store: AppState, { payload }: Action<Actions.ServerStartPayload>) =>
      store.updateStatus(payload.status),

    [ActionTypes.APP_07_SUCCESS]: (store: AppState, { payload }: Action<Actions.ServerStopPayload>) =>
      store.updateStatus(payload.status),

    [ActionTypes.APP_08_SUCCESS]: (store: AppState, { payload }: Action<Actions.ServerStatusPayload>) =>
      store.updateStatus(payload.status),

    /** グループ選択 */
    [ActionTypes.APP_09_SUCCESS]: (store: AppState, { payload }: Action<Actions.App09Payload>) =>
      store.setGroupId(payload.groupId),

    /** 画面表示制御 */
    [ActionTypes.APP_10_REQUEST]: (store: AppState) => store,
    [ActionTypes.APP_10_SUCCESS]: (store: AppState, { payload }: Action<Actions.App10Payload>) =>
      store.setShow(payload),
    [ActionTypes.APP_10_FAILURE]: (store: AppState) => store,
  },
  new AppState()
);

export default reducer;
