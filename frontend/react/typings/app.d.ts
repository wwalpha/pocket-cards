import * as API from './api';
import * as Actions from './actions';
import { ThunkActionDispatch } from './redux-thunk';

declare module '*.svg' {
  const content: string;
  export default content;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

export interface GroupWordsItem {
  groupId: string;
  words: C002ResItem[];
}

export type PathInfo = { [key: string]: ScreenInfo };

export interface ScreenInfo {
  showFooter: boolean;
  showBack: boolean;
  title?: string;
}

// export interface Actions {
//   App: {
//     // タブ画面変更
//     tabChange(index: number): ThunkActionDispatch<Actions.TabChangeAction>;
//     /** Set loggedin status */
//     loggedIn(user: CognitoUser): ThunkActionDispatch<Actions.LoggedInAction>;
//     /** Set loggedin status */
//     logout(): ThunkActionDispatch<typeof logout>;
//     /** server start */
//     start(): ThunkActionDispatch<Actions.ServerStartAction>;
//     /** server stop */
//     stop(): ThunkActionDispatch<Actions.ServerStopAction>;
//     /** server status */
//     status(): ThunkActionDispatch<Actions.ServerStatusAction>;
//     /** group select */
//     groupSelect(): ThunkActionDispatch<Actions.GroupSelectAction>;
//     /** display control */
//     show(type: Consts.ShowTypes, value: boolean): ThunkActionDispatch<Actions.ShowAction>;
//   };
//   Word: {
//     list(): ThunkActionDispatch<typeof list>;
//   };
//   Group: {
//     // グループ一覧取得
//     list(): ThunkActionDispatch<Actions.GroupListAction>;
//     /** Header Visible */
//     regist(name: string, description?: string): ThunkActionDispatch<Actions.GroupRegistAction>;
//     // グループ削除
//     delete(): ThunkActionDispatch<Actions.GroupDeleteAction>;
//     // グループ編集
//     edit(): ThunkActionDispatch<Actions.GroupEditAction>;
//   };
//   Study: {
//     /** 新規単語学習 */
//     startNew: (history: History<any>) => void;
//     /** テスト回答(YES/NO) */
//     answer: (word: string, yes: boolean) => Actions.AnswerAction;
//     /** 単語復習 */
//     startReview: (history: History<any>) => Actions.StartReviewAction;
//     /** 単語テスト（全部）*/
//     startTest: (history: History<any>) => Actions.StartTestAction;
//   };
// }
