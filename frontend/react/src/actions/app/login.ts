import { createAction } from 'redux-actions';
import { CognitoUser } from '@aws-amplify/auth';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';
import { status } from './status';

const success = createAction(ActionTypes.APP_04_SUCCESS, (user: CognitoUser): Actions.LoggedInPayload => ({ user }));

/** ログイン状態変更 */
export const loggedIn: Actions.LoggedInAction = (user) => async (dispatch) => {
  dispatch(startLoading());

  try {
    // 画面初期化
    dispatch(status());
    // データ保存
    dispatch(success(user));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
