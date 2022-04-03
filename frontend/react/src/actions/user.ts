import { withLoading } from '@actions';
import { Paths } from '@constants';
import { Actions } from '@reducers';
import { push } from 'connected-react-router';
import { AppDispatch } from 'typings';

/** ログイン */
export const signin = (username: string, passwd: string, newPassword?: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // sign in
      const res = await dispatch(
        Actions.SIGN_IN({
          username: username,
          password: passwd,
          newPassword: newPassword,
        })
      ).unwrap();

      if (res.success !== 'true') {
        dispatch(Actions.APP_SHOW_ERROR(res.message || 'Unknown Error'));
      } else {
        dispatch(push(Paths.PATHS_ADMIN_DASHBOARD));
        // initialize
        dispatch(Actions.GROUP_LIST());
      }
    })
  );

export const signup = (username: string, email: string, status: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // sign in
      const res = await dispatch(
        Actions.SIGN_UP({
          userId: email,
          userName: username,
          email: email,
          status: status,
        })
      ).unwrap();

      if (res.success == true) {
        // Sign In
        dispatch(push(Paths.PATHS_SIGN_IN));

        // success
        dispatch(Actions.APP_SHOW_SUCCESS('User regist success.'));
      } else {
        // success
        dispatch(Actions.APP_SHOW_ERROR(res.message || ''));
      }
    })
  );

/** ログアウト */
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.SIGN_OUT);
};
