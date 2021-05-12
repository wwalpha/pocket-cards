import { createAction } from 'redux-actions';
import { defaultRequest, defaultFailure } from '@actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(
  ActionTypes.APP_10_SUCCESS,
  (type: number, value: boolean): Actions.App10Payload => ({
    type,
    value,
  })
);

/** 画面表示制御 */
export const show: Actions.ShowAction = (type: number, value: boolean) => async (dispatch) => {
  dispatch(defaultRequest());

  try {
    dispatch(success(type, value));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
