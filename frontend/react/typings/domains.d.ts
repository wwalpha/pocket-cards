import { CognitoUser } from '@aws-amplify/auth';
import { APIs, Tables, App, Group } from '.';

export namespace Domains {
  interface AppState {
    tabIndex: number;
    // loading
    isLoading: boolean;
    // server status
    status: string;
    // display control
    displayCtrl: Record<number, boolean>;
  }

  interface GroupState {
    activeGroup: string;
    /** group word list for display */
    activeGroupList: Group.WordDetails[];
    /** user's all group infomations */
    groups: Tables.TGroups[];
    /** Group word list */
    groupWords: Group.GroupWords;
    /** Group word list */
    regists: string[];
    /** word detail */
    current?: Group.WordDetails;
  }

  interface UserState {
    details?: User.Details;
    remainingTest: number;
    remainingReview: number;
    daily: number;
    dailyNew: number;
    dailyReview: number;
    weekly: number;
    monthly: number;
  }

  interface StudyState {
    current?: Group.WordItem;
    mode: string;
    rows: Group.WordItem[];
    history: Group.WordItem[];
    index: number;
  }
}
