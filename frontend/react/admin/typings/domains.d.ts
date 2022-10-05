import { APIs, Tables, App, Group } from '.';

export namespace Domains {
  interface States {
    router: any;
    app: AppState;
    group: GroupState;
    user: UserState;
    study: StudyState;
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
    // // active subject
    // activeSubject: string;
    // // active group
    // activeGroup: string;
    // authority
    authority?: string;
    // websocket connection
    isConnectionEstablished: boolean;
  }

  interface GroupState {
    /** edit mode */
    editable: number;
    /** user's all group infomations */
    groups: Tables.TGroups[];
    /** Questions */
    questions: Tables.TQuestions[];
    /** Upload Questions */
    uploads: Omit<Tables.TQuestions, 'id', 'groupId'>[];
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
    // inquiries
    inquiries: Tables.TQuestions[];
    // user informations
    infos?: Tables.TUsers;
    // selected student
    activeStudent: string;
  }

  interface StudyState {
    isOnline: boolean;
    answered: string[];
    questions: Tables.TQuestions[];
    index: number;
    student: string;
    subject: string;
  }
}
