import { APIs, Tables, App, Group } from '.';

export namespace Domains {
  interface AppState {
    // message type
    severity?: 'success' | 'info' | 'warning' | 'error';
    // message
    message?: string;
    // stack open flag
    showSnackbar: boolean;
    // show user regist
    showUserRegist: boolean;
    // tab index
    tabIndex: number;
    // loading
    isLoading: boolean;
    // server status
    status: string;
    // display control
    displayCtrl: Record<number, boolean>;
    // active subject
    activeSubject: string;
  }

  interface GroupState {
    // search word
    searchWord: string;
    // active group
    activeGroup: string;
    /** edit mode */
    editable: number;
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
    /** Questions */
    questions: Group.Question[];
  }

  interface UserState {
    // 0: not login, 1: new password, 2: logined
    loginStatus: number;
    // username
    username: string;
    // password
    password?: string;
    // authority
    authority?: string;
    // curriculums
    curriculums: Tables.TCurriculums[];
    // students
    students: Tables.TUsers[];
  }

  interface StudyState {
    current?: Group.WordItem;
    mode: string;
    rows: Group.WordItem[];
    history: Group.WordItem[];
    index: number;
  }
}
