import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions, APIs } from 'typings';

const success = createAction<Actions.GroupWordsPayload, string, APIs.C002Response>(
  ActionTypes.GROUP_SUCCESS_WORDS,
  (groupId: string, datas: APIs.C002Response) => ({
    groupId,
    datas,
  })
);

/** グループの単語一覧 */
export const words: Actions.GroupWordsAction = (groupId: string) => async (dispatch, _, api) => {
  // グループリスト開始イベント
  dispatch(startLoading());

  try {
    const res = await api.get<APIs.C002Response>(Consts.C002_URL(groupId));
    // データ保存
    dispatch(success(groupId, res));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
