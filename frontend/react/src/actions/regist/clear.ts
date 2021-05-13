import { createAction } from 'redux-actions';
import { startLoading, defaultFailure } from '@actions';
import { ActionTypes } from '@constants';
import { APP, Actions } from 'typings';

const success = createAction(ActionTypes.A0_04_SUCCESS);

/** 単語クリア */
export const clear: Actions.ClearAction = () => (dispatch) => {
  dispatch(startLoading());

  try {
    dispatch(success());
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
