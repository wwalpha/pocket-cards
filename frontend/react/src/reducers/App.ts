import { handleActions, Action } from 'redux-actions';
import { AppState } from '@domains';
import { ActionTypes } from '@constants';
import { App01Payload, App04Payload, App07Payload, App09Payload, App08Payload, App06Payload } from '@actions/app';
import { App10Payload } from '@actions/app/Actions';

const reducer = handleActions<AppState, any>(
  {
    /** タブ変更 */
    [ActionTypes.APP_01_REQUEST]: (store: AppState) => store,
    [ActionTypes.APP_01_SUCCESS]: (store: AppState, { payload: { index } }: Action<App01Payload>) =>
      store.tabChange(index),
    [ActionTypes.APP_01_FAILURE]: (store: AppState) => store,

    /** ユーザ情報設定 */
    [ActionTypes.APP_04_REQUEST]: (store: AppState) => store.startLoading(),
    [ActionTypes.APP_04_SUCCESS]: (store: AppState, { payload }: Action<App04Payload>) =>
      store.loggedIn(payload.user).endLoading(),
    [ActionTypes.APP_04_FAILURE]: (store: AppState) => store.endLoading(),

    /** ログアウト */
    [ActionTypes.APP_05_REQUEST]: (store: AppState) => store.startLoading(),
    [ActionTypes.APP_05_SUCCESS]: (store: AppState) => store.logout(),
    [ActionTypes.APP_05_FAILURE]: (store: AppState) => store.endLoading(),

    /** サーバ関連 */
    [ActionTypes.APP_06_REQUEST]: (store: AppState) => store.startLoading(),
    [ActionTypes.APP_06_SUCCESS]: (store: AppState, { payload }: Action<App06Payload>) =>
      store.updateStatus(payload.status).endLoading(),
    [ActionTypes.APP_06_FAILURE]: (store: AppState) => store.endLoading(),

    [ActionTypes.APP_07_REQUEST]: (store: AppState) => store.startLoading(),
    [ActionTypes.APP_07_SUCCESS]: (store: AppState, { payload }: Action<App07Payload>) =>
      store.updateStatus(payload.status).endLoading(),
    [ActionTypes.APP_07_FAILURE]: (store: AppState) => store.endLoading(),

    [ActionTypes.APP_08_REQUEST]: (store: AppState) => store.startLoading(),
    [ActionTypes.APP_08_SUCCESS]: (store: AppState, { payload }: Action<App08Payload>) =>
      store.updateStatus(payload.status).endLoading(),
    [ActionTypes.APP_08_FAILURE]: (store: AppState) => store.endLoading(),

    /** グループ選択 */
    [ActionTypes.APP_09_REQUEST]: (store: AppState) => store,
    [ActionTypes.APP_09_SUCCESS]: (store: AppState, { payload }: Action<App09Payload>) =>
      store.setGroupId(payload.groupId),
    [ActionTypes.APP_09_FAILURE]: (store: AppState) => store,

    /** 画面表示制御 */
    [ActionTypes.APP_10_REQUEST]: (store: AppState) => store,
    [ActionTypes.APP_10_SUCCESS]: (store: AppState, { payload }: Action<App10Payload>) => store.setShow(payload),
    [ActionTypes.APP_10_FAILURE]: (store: AppState) => store,
  },
  new AppState()
);

export default reducer;
