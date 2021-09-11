import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { createAction } from 'redux-actions';
import { APIs, Actions } from 'typings';

export const success = createAction<Actions.WordDeletePayload, string, string>(
  ActionTypes.WORDS_SUCCESS_DELETE,
  (groupId, word) => ({
    groupId,
    word,
  })
);

/** 単語削除 */
const deleteRow: Actions.WordDeleteAction = (groupId: string, word: string) => async (dispatch, _, api) => {
  // 単語削除開始イベント
  dispatch(startLoading());

  try {
    // データ保存
    dispatch(success(groupId, word));

    await api.del<APIs.C005Response>(Consts.C005_URL(groupId, word));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default deleteRow;
