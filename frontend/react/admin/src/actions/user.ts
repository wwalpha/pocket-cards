import { withLoading } from '@actions';
import { Consts, ROUTE_PATHS } from '@constants';
import { Actions } from '@reducers';
import { push } from 'connected-react-router';
import { AppDispatch } from 'typings';

/** サインイン */
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
      // initialize
      dispatch(Actions.GROUP_LIST());
      dispatch(Actions.APP_SET_AUTHORITY(res.authority));

      // login success
      if (res.authority === Consts.Authority.PARENT) {
        // initialize
        dispatch(Actions.USER_CURRICULUM_LIST());
        // initialize
        dispatch(Actions.USER_INFORMATIONS());
        // initialize
        dispatch(Actions.USER_STUDENT_LIST());
      }
    })
  );

/** サインアウト */
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

/** ユーザ情報取得 */
export const getUserInfo = () => (dispatch: AppDispatch) => dispatch(Actions.USER_INFORMATIONS());

/** 連絡先更新 */
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

/** 生徒切替 */
export const setActiveStudent = (id: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.USER_ACTIVE_STUDENT(id));
};

/** カリキュラム登録 */
export const curriculumRegist = (groupId: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(Actions.USER_CURRICULUM_REGIST(groupId));
    })
  );

/** カリキュラム削除 */
export const curriculumRemove = (id: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(Actions.USER_CURRICULUM_REMOVE(id));
    })
  );

/** 生徒一覧 */
export const getStudentList = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(Actions.USER_STUDENT_LIST());

      dispatch(push(ROUTE_PATHS.STUDENTS));
    })
  );

/** 生徒登録 */
export const studentRegist = (username: string, password: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.USER_STUDENT_REGIST({ username, password })).unwrap();

      dispatch(Actions.APP_SHOW_USER_REGIST(false));

      getStudentList()(dispatch);
    })
  );
