import { App10Payload } from '@actions/app';
import { CognitoUser } from '@aws-amplify/auth';
import { Consts, Paths } from '@constants';
import { immerable, produce } from 'immer';

export default class AppState {
  [immerable] = true;

  tabIndex: number = Paths.ROUTE_PATH_INDEX.Regist;
  // loading
  isLoading: boolean = false;
  // User info
  user: CognitoUser | undefined;
  // selected group id
  groupId: string = '';
  // server status
  status: string = Consts.SERVER_STATUS.STOPPED;
  // グループ一覧画面の削除ボタン表示フラグ
  displayCtrl: { [key: number]: boolean } = {};

  tabChange(index: number) {
    return produce(this, (draft) => {
      draft.tabIndex = index;
    });
  }

  setGroupId(groupId: string) {
    return produce(this, (draft) => {
      draft.groupId = groupId;
    });
  }

  loggedIn(user: CognitoUser) {
    return produce(this, (draft) => {
      draft.user = user;
    });
  }

  logout() {
    return produce(this, (draft) => {
      draft.user = undefined;
    });
  }

  setShow({ type, value }: App10Payload) {
    return produce(this, (draft) => {
      draft.displayCtrl[type] = value;
    });
  }

  /** 取込中 */
  startLoading() {
    return produce(this, (draft) => {
      draft.isLoading = true;
    });
  }

  endLoading() {
    return produce(this, (draft) => {
      draft.isLoading = false;
    });
  }

  updateStatus(status: string) {
    return produce(this, (draft) => {
      draft.status = status;
    });
  }
}
