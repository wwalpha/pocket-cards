import { CognitoUser } from '@aws-amplify/auth';
import { Consts, Paths } from '@constants';
import { immerable, produce } from 'immer';
import { Actions, App } from 'typings';

export default class AppState {
  [immerable] = true;

  tabIndex: number = Paths.ROUTE_PATH_INDEX.Regist;
  // loading
  isLoading: boolean = false;
  // User info
  userInfo: CognitoUser | undefined;
  // selected group id
  groupId: string = '';
  // server status
  status: string = Consts.SERVER_STATUS.STOPPED;
  // グループ一覧画面の削除ボタン表示フラグ
  displayCtrl: Record<number, boolean> = {};
  /** word detail */
  details?: App.WordDetail = undefined;

  /**
   * Set active tab index
   * @param index tab index
   */
  tabChange(index: number) {
    return produce(this, (draft) => {
      draft.tabIndex = index;
    });
  }

  /**
   * Set active group id
   *
   * @param groupId group id
   */
  setGroupId(groupId: string) {
    return produce(this, (draft) => {
      draft.groupId = groupId;
    });
  }

  /**
   * 単語詳細情報を設定する
   *
   * @param details details
   * @returns
   */
  setWordDetail(details: App.WordDetail) {
    return produce(this, (draft) => {
      draft.details = details;
    });
  }

  /**
   * Sign in
   *
   * @param user Cognito user informations
   */
  signIn(user: CognitoUser) {
    return produce(this, (draft) => {
      draft.userInfo = user;
    });
  }

  /**
   * Sign out
   */
  signOut() {
    return produce(this, (draft) => {
      draft.userInfo = undefined;
    });
  }

  setShow({ type, value }: Actions.App10Payload) {
    return produce(this, (draft) => {
      draft.displayCtrl[type] = value;
    });
  }

  /**
   * Start loading
   */
  startLoading() {
    return produce(this, (draft) => {
      draft.isLoading = true;
    });
  }

  /**
   * Stop loading
   */
  endLoading() {
    return produce(this, (draft) => {
      draft.isLoading = false;
    });
  }

  /**
   * Update ECS service status
   *
   * @param status ECS service status
   */
  updateStatus(status: string) {
    return produce(this, (draft) => {
      draft.status = status;
    });
  }
}
