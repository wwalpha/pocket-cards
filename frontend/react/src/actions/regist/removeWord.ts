import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction<Actions.RegistRemovePayload, string>(
  ActionTypes.REGIST_SUCCESS_REMOVE,
  (word: string) => ({
    word,
  })
);

/** 指定単語削除 */
export const removeWord: Actions.RemoveWordAction = (word: string) => (dispatch) => {
  dispatch(success(word));
};
