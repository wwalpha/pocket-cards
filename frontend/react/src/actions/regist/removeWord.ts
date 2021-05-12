import { createAction } from 'redux-actions';
import { defaultRequest, defaultFailure } from '@actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(ActionTypes.A0_02_SUCCESS, (word: string) => ({ word }));

/** 指定単語削除 */
export const removeWord: Actions.RemoveWordAction = (word: string) => (dispatch) => {
  // 画像アップロード開始イベント
  dispatch(defaultRequest());

  try {
    dispatch(success(word));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
