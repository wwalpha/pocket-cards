import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, APIs, App } from 'typings';
import { list } from './list';

const success = createAction(ActionTypes.E0_03_SUCCESS);

/** グループ編集 */
export const edit: Actions.GroupEditAction = (info: App.GroupInfo) => async (dispatch, store, api) => {
  // 開始イベント
  dispatch(startLoading());

  try {
    // グループ編集API
    await api.put(Consts.B004_URL(info.id), {
      name: info.name,
      description: info.description,
    } as APIs.B004Request);

    // グループ再取得
    dispatch(list());
    // グループリスト画面に遷移する
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
    // 正常終了
    dispatch(success());
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
