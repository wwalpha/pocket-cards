import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(ActionTypes.REGIST_SUCCESS_CLEAR);

/** 単語クリア */
export const clear: Actions.ClearAction = () => (dispatch) => {
  dispatch(success());
};
