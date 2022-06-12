import { ROUTE_PATHS } from '@constants';
import { Actions } from '@reducers';
import { push } from 'connected-react-router';
import { AppDispatch } from 'typings';

/** ログイン */
export const signin = (username: string, passwd: string, newPassword?: string) => async (dispatch: AppDispatch) => {
  // sign in
  const res = await dispatch(
    Actions.USER_SIGN_IN({
      username: username,
      password: passwd,
      newPassword: newPassword,
    })
  ).unwrap();

  if (res.success !== 'true') {
    dispatch(Actions.APP_SHOW_ERROR(res.message || 'Unknown Error'));
    return;
  }

  dispatch(push(ROUTE_PATHS.ROOT));
};

export const signup = (username: string, email: string) => async (dispatch: AppDispatch) => {
  // sign in
  const res = await dispatch(
    Actions.USER_SIGN_UP({
      userId: email,
      userName: username,
      email: email,
    })
  ).unwrap();

  if (res.success == true) {
    // Sign In
    dispatch(push(ROUTE_PATHS.SIGN_IN));

    // success
    dispatch(Actions.APP_SHOW_SUCCESS('User regist success.'));
  } else {
    // success
    dispatch(Actions.APP_SHOW_ERROR(res.message || ''));
  }
};
