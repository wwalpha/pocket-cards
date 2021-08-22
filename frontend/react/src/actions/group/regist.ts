import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, APIs, Tables } from 'typings';

const success = createAction(ActionTypes.B001_SUCCESS_GROUP_REGIST, (info: Tables.TGroups) => info);

/** グループ登録 */
export const regist: Actions.GroupRegistAction = (name: string, description?: string) => async (dispatch, _, api) => {
  // グループ登録開始イベント
  dispatch(startLoading());

  try {
    const res = await api.put<APIs.B001Response>(Consts.B001_URL(), {
      name,
      description,
    } as APIs.B001Request);

    // データ保存
    dispatch(
      success({
        id: res.groupId,
        name: name,
        description: description,
        count: 0,
      })
    );

    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
