import { withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions } from '@reducers';
import { createAction } from '@reduxjs/toolkit';
import { Credentials } from '@utils';
import { push } from 'connected-react-router';
import { AppDispatch } from 'typings';

/** ログイン */
export const signin = (username: string, passwd: string, newPassword?: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
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

      // login success
      if (res.authority === Consts.Authority.ADMIN) {
        dispatch(push(Paths.PATHS_ADMIN_DASHBOARD));
        // initialize
        dispatch(Actions.GROUP_LIST());
      } else if (res.authority === Consts.Authority.PARENT) {
        dispatch(push(Paths.PATHS_GUARDIAN_TOP));
        // initialize
        dispatch(Actions.GROUP_LIST());
        // initialize
        dispatch(Actions.USER_CURRICULUM_LIST());
      }
    })
  );

export const signup = (username: string, email: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
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
        dispatch(push(Paths.PATHS_SIGN_IN));

        // success
        dispatch(Actions.APP_SHOW_SUCCESS('User regist success.'));
      } else {
        // success
        dispatch(Actions.APP_SHOW_ERROR(res.message || ''));
      }
    })
  );
