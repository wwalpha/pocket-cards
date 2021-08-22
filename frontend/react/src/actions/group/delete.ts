import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions } from 'typings';

const success = createAction<Actions.B005Payload, string>(ActionTypes.GROUP_SUCCESS_DELETE, (groupId: string) => ({
  groupId,
}));

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

    // グループリスト画面に遷移する
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
