import { push } from 'connected-react-router';
import { Consts, ROUTE_PATHS } from '@constants';
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

  dispatch(push(ROUTE_PATHS.SIGN_IN));
};

/** selected subject */
export const activeSubject = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_SUBJECT(id));

  switch (id) {
    case Consts.SUBJECT.JAPANESE.toString():
      dispatch(push(ROUTE_PATHS.ROOT_LANGUAGE));
      break;
    case Consts.SUBJECT.SCIENCE.toString():
      dispatch(push(ROUTE_PATHS.ROOT_SCIENCE));
      break;
    case Consts.SUBJECT.SOCIETY.toString():
      dispatch(push(ROUTE_PATHS.ROOT_SOCIETY));
      break;
    case Consts.SUBJECT.ENGLISH.toString():
      dispatch(push(ROUTE_PATHS.ROOT_ENGLISH));
      break;
    default:
      dispatch(push(ROUTE_PATHS.ROOT));
  }
};

/** selected group */
export const activeGroup = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_GROUP(id));
};
