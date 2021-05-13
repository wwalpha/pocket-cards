import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(ActionTypes.APP_05_SUCCESS);

/** ログアウト */
export const logout: Actions.LogoutAction = () => async (dispatch) => {
  // データ保存
  dispatch(success());
};
