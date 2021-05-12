import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, defaultRequest } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, API, APP } from 'typings';
import { list } from './list';

const success = createAction(ActionTypes.E0_03_SUCCESS);

/** グループ編集 */
export const edit: Actions.GroupEditAction = (info: APP.GroupInfo) => async (dispatch, store, api) => {
  // 開始イベント
  dispatch(defaultRequest());

  try {
    // グループ編集API
    await api.put(Consts.B004_URL(info.id), {
      name: info.name,
      description: info.description,
    } as API.B004Request);

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
