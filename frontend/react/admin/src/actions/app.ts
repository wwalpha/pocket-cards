import { push } from 'connected-react-router';
import { Paths } from '@constants';
import { Credentials } from '@utils';
import { Actions } from '@reducers';
import { AppDispatch } from '@store';

/** close snackbar */
export const closeSnackbar = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_CLOSE_SNACKBAR());
};

/** show success snackbar */
export const showSuccess = (text: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_SUCCESS(text));
};

/** show success snackbar */
export const showError = (text: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_ERROR(text));
};

export const showUserRegist = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_USER_REGIST(true));
};

export const hideUserRegist = () => (dispatch: AppDispatch) => {
  dispatch(Actions.APP_SHOW_USER_REGIST(false));
};

/** ログアウト */
export const logout = () => (dispatch: AppDispatch) => {
  // clean credentials
  Credentials.clean();

  dispatch(Actions.APP_LOGOUT());

  dispatch(push(Paths.PATHS_SIGN_IN));
};

/** selected subject */
export const activeSubject = (id: string, pathname: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_SUBJECT(id));
  // move to top page
  if (pathname !== Paths.PATHS_ROOT) {
    dispatch(push(Paths.PATHS_ROOT));
  }
};

/** selected group */
export const activeGroup = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_GROUP(id));
};
