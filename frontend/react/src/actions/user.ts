import { withLoading } from '@actions';
import { Consts } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { AppDispatch, APIs, Auth } from 'typings';

/** ログイン */
export const signin = (username: string, passwd: string, newPassword?: string) => async (dispatch: AppDispatch) => {
  // sign in
  await dispatch(
    Actions.SIGN_IN({
      username: username,
      password: passwd,
      newPassword: newPassword,
    })
  ).unwrap();
};

/** ログアウト */
export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.USER_SIGN_OUT);
};

/** 学習履歴 */
export const history = () => async (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // const res = await API.get<APIs.A002Response>(Consts.A002_URL());
      // dispatch(Actions.USER_HISTORY(res));
    })
  );
