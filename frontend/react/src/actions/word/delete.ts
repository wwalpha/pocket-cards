import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { APIs, Actions } from 'typings';

export const success = createAction<Actions.WordDeletePayload, string, string>(
  ActionTypes.GROUP_SUCCESS_REMOVE_WORD,
  (groupId: string, word: string) => ({
    groupId,
    word,
  })
);

/** 単語削除 */
const del: Actions.WordDeleteAction = (groupId: string, word: string) => async (dispatch, _, api) => {
  // 単語削除開始イベント
  dispatch(startLoading());

  try {
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]));

    api.del<APIs.C005Response>(Consts.C005_URL(groupId, word));

    // データ保存
    dispatch(success(groupId, word));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default del;
