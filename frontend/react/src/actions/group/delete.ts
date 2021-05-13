import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions } from 'typings';

const success = createAction(ActionTypes.E0_04_SUCCESS, (groupId: string) => ({ groupId }));

/** グループ削除 */
export const del: Actions.GroupDeleteAction = () => async (dispatch, store, api) => {
  // グループリスト開始イベント
  dispatch(startLoading());

  try {
    // 選択中のGroupId
    const { groupId } = store().app;

    // グループ削除API
    await api.del(Consts.B005_URL(groupId));

    // 正常終了
    dispatch(success(groupId));

    const t = push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]);
    // グループリスト画面に遷移する
    dispatch(t);
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
