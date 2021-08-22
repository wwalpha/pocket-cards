import { CognitoUser } from '@aws-amplify/auth';
import { APIs, Tables, App } from '.';

export namespace Domains {
  interface State {
    // App共通設定
    app: App;
    group: Group;
    word: Word;
    user: User;
  }

  interface App {
    tabIndex: number;
    // loading
    isLoading: boolean;
    // User info
    userInfo: CognitoUser | undefined;
    // selected group id
    groupId: string;
    // server status
    status: string;
    displayCtrl: Record<number, boolean>;
  }

  interface Group {
    /** user's all group infomations */
    groups: Tables.TGroups[];
    /** Group word list */
    groupWords: App.GroupWords;
    /** Group word list */
    regists: string[];
  }

  interface User {
    remainingTest: number;
    remainingReview: number;
    daily: number;
    dailyNew: number;
    dailyReview: number;
    weekly: number;
    monthly: number;
  }

  interface Word {
    current?: APIs.WordItem;
    mode?: string;
    rows: APIs.WordItem[];
    history: APIs.WordItem[];
    index: number;
  }
}
