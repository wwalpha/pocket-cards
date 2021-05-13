import { createAction } from 'redux-actions';
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
  dispatch(success(type, value));
};
