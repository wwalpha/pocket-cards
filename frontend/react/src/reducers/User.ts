import { User } from '@domains';
import { handleActions, Action } from 'redux-actions';
import { ActionTypes } from '@constants';
import { C001Payload } from '@actions/mypage';

const reducer = handleActions<User, any>(
  {
    /** 学習履歴取得 */
    [ActionTypes.C0_01_REQUEST]: (store: User) => store.startLoading(),
    [ActionTypes.C0_01_SUCCESS]: (store: User, { payload }: Action<C001Payload>) =>
      store.setHistory(payload.data).endLoading(),
    [ActionTypes.C0_01_FAILURE]: (store: User) => store.endLoading(),
  },
  new User()
);

export default reducer;
