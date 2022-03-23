import { withLoading } from '@actions';
import { CognitoUser } from '@aws-amplify/auth';
import { Consts } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { AppDispatch, APIs } from 'typings';

/** ログイン */
export const loggedIn = (user: CognitoUser) => async (dispatch: AppDispatch) => {
  // 画面初期化
  // status();
  // データ保存
  dispatch(
    Actions.USER_SIGN_IN({
      username: user.getUsername(),
    })
  );
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
