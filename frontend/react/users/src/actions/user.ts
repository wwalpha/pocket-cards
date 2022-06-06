import { withLoading } from '@actions';
import { ROUTE_PATHS } from '@constants';
import { Actions } from '@reducers';
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

      dispatch(push(ROUTE_PATHS.ROOT));
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
        dispatch(push(ROUTE_PATHS.SIGN_IN));

        // success
        dispatch(Actions.APP_SHOW_SUCCESS('User regist success.'));
      } else {
        // success
        dispatch(Actions.APP_SHOW_ERROR(res.message || ''));
      }
    })
  );

export const getUserInfo = () => (dispatch: AppDispatch) => dispatch(Actions.USER_INFORMATIONS());

export const updateNotifications = (notifications: string[]) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // sign in
      dispatch(
        Actions.USER_UPDATE_NOTIFICATIONS({
          notifications,
        })
      );
    })
  );

export const setActiveStudent = (id: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.USER_ACTIVE_STUDENT(id));
};
