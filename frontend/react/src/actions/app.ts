import { withLoading } from '@actions';
import { Consts } from '@constants';
import { API } from '@utils';
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
