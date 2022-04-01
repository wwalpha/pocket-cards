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
      await dispatch(
        Actions.SIGN_IN({
          username: username,
          password: passwd,
          newPassword: newPassword,
        })
      ).unwrap();
    })
  );

export const signup = (username: string, email: string, role: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // sign in
      await dispatch(
        Actions.SIGN_UP({
          userId: email,
          userName: username,
          email: email,
          role: role,
        })
      ).unwrap();

      // Sign In
      dispatch(push(Paths.PATHS_SIGN_IN));
    })
  );

/** ログアウト */
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.SIGN_OUT);
};

/** 学習履歴 */
// export const history = () => async (dispatch: AppDispatch) =>
//   dispatch(
//     withLoading(async () => {
//       // const res = await API.get<APIs.A002Response>(Consts.A002_URL());
//       // dispatch(Actions.USER_HISTORY(res));
//     })
//   );
