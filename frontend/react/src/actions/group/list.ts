import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions, APIs } from 'typings';

const success = createAction(ActionTypes.E0_01_SUCCESS, (data: APIs.B002Response) => ({
  ...data,
}));

/** グループリスト */
export const list: Actions.GroupListAction = () => async (dispatch, _, api) => {
  // グループリスト開始イベント
  dispatch(startLoading());

  try {
    const res = await api.get<APIs.B002Response>(Consts.B002_URL());
    // データ保存
    dispatch(success(res));

    // グループの単語一覧を取得する
    // res.groups.forEach((item) => {
    // TODO:!!!
    // dispatch(Actions.list(item.id));
    // });
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
