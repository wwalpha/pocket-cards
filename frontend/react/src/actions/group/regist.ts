import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, API, APP } from 'typings';

const success = createAction(ActionTypes.E0_02_SUCCESS, (info: APP.GroupInfo) => info);

/** グループ登録 */
export const regist: Actions.GroupRegistAction = (name: string, description?: string) => async (dispatch, _, api) => {
  // グループ登録開始イベント
  dispatch(startLoading());

  try {
    const res = await api.put<API.B001Response>(Consts.B001_URL(), {
      name,
      description,
    } as API.B001Request);

    // データ保存
    dispatch(
      success({
        id: res.groupId,
        name: name,
        description: description,
      })
    );

    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
