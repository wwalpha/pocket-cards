import { handleActions, Action } from 'redux-actions';
import { AppState } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<AppState, any>(
  {
    /** Set Loading Start */
    [ActionTypes.COM_01_SUCCESS]: (store: AppState) => store.startLoading(),
    /** Set Loading End */
    [ActionTypes.COM_02_SUCCESS]: (store: AppState) => store.endLoading(),
    /** Set Loading End */
    [ActionTypes.COM_01_FAILURE]: (store: AppState) => store.endLoading(),

    /** タブ変更 */
    [ActionTypes.APP_01_SUCCESS]: (store: AppState, { payload: { index } }: Action<Actions.TabChangePayload>) =>
      store.tabChange(index),

    /** ユーザ情報設定 */
    [ActionTypes.APP_04_SUCCESS]: (store: AppState, { payload }: Action<Actions.LoggedInPayload>) =>
      store.signIn(payload.user),

    /** ログアウト */
    [ActionTypes.APP_05_SUCCESS]: (store: AppState) => store.signOut(),

    /** 単語詳細 */
    [ActionTypes.WORDS_SUCCESS_DETAILS]: (store: AppState, { payload }: Action<Actions.WordDetailPayload>) =>
      store.setWordDetail(payload.datas),

    /** サーバ関連 */
    [ActionTypes.APP_SUCCESS_SERVER_START]: (store: AppState, { payload }: Action<Actions.ServerStartPayload>) =>
      store.updateStatus(payload.status),

    [ActionTypes.APP_SUCCESS_SERVER_STOP]: (store: AppState, { payload }: Action<Actions.ServerStopPayload>) =>
      store.updateStatus(payload.status),

    [ActionTypes.APP_SUCCESS_SERVER_STATUS]: (store: AppState, { payload }: Action<Actions.ServerStatusPayload>) =>
      store.updateStatus(payload.status),

    /** グループ選択 */
    [ActionTypes.APP_SUCCESS_GROUP_SELECT]: (store: AppState, { payload }: Action<Actions.GroupSelectPayload>) =>
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
