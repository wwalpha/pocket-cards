import { CognitoUser } from '@aws-amplify/auth';
import { Actions } from '@reducers';
import { AppDispatch } from '@store';

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
