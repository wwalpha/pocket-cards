import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { createAction } from 'redux-actions';
import { APIs, Actions } from 'typings';

export const success = createAction(
  ActionTypes.E0_05_SUCCESS,
  (groupId: string, data: APIs.C002Response): Actions.E005Payload => ({
    groupId,
    words: data,
  })
);

/** グループリスト */
const list: Actions.WordListAction = (groupId: string) => async (dispatch, _, api) => {
  // グループリスト開始イベント
  dispatch(startLoading());

  try {
    const res = await api.get<APIs.C002Response>(Consts.C002_URL(groupId));

    // データ保存
    dispatch(success(groupId, res));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default list;
