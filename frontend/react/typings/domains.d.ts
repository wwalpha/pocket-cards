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
    // sign status
    isLogined: boolean;
    // username
    username: string;
    // mfa required flag
    mfaRequired?: boolean;
    // new password required flag
    newPasswordRequired?: boolean;
    // Tokens
    tokens: {
      idToken?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface GroupState {
    // search word
    searchWord: string;
    // active group
    activeGroup: string;
    /** user's all group infomations */
    groups: Tables.TGroups[];
    /** Group word list */
    groupWords: Group.GroupWords;
    /** Group word list */
    regists: string[];
    /** word detail */
    current?: Group.WordDetails;
    /** group learn status */
    status?: Group.Status;
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
