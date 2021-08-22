import { push } from 'connected-react-router';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions, APIs, App } from 'typings';
import { list } from './list';

/** グループ編集 */
export const edit: Actions.GroupEditAction = (info: App.GroupInfo) => async (dispatch, _, api) => {
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
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
