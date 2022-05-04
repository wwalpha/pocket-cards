import { APIs, Tables, App, Group } from '.';

export namespace Domains {
  interface States {
    router: any;
    app: AppState;
    group: GroupState;
    user: UserState;
  }

  interface AppState {
    // message type
    severity?: 'success' | 'info' | 'warning' | 'error';
    // message
    message?: string;
    // stack open flag
    showSnackbar: boolean;
    // show user regist
    showUserRegist: boolean;
    // loading
    isLoading: boolean;
    // server status
    status: string;
    // active subject
    activeSubject: string;
    // active group
    activeGroup: string;
    // authority
    authority?: string;
  }

  interface GroupState {
    /** edit mode */
    editable: number;
    /** user's all group infomations */
    groups: Tables.TGroups[];
    /** Questions */
    questions: Group.Question[];
    /** Upload Questions */
    uploads: Omit<Group.Question, 'id'>[];
  }

  interface UserState {
    // 0: not login, 1: new password, 2: logined
    loginStatus: number;
    // username
    username: string;
    // password
    password?: string;
    // curriculums
    curriculums: Tables.TCurriculums[];
    // students
    students: Tables.TUsers[];
    // user informations
    infos?: Tables.TUsers;
    // selected student
    activeStudent: string;
  }

  interface StudyState {
    current?: Group.WordItem;
    mode: string;
    rows: Group.WordItem[];
    history: Group.WordItem[];
    index: number;
  }
}
