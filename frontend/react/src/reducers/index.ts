import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';
import Study from './study';
import Group from './group';
import User from './user';
import {
  GROUP_LIST,
  GROUP_DELETE,
  GROUP_WORD_LIST,
  GROUP_WORD_DETAILS,
  GROUP_STATUS,
  GROUP_QUESTION_LIST,
} from './groupActions';
import { STUDY_START, STUDY_CONTINUE, STUDY_IGNORE, STUDY_TODOS } from './studyActions';
import { SIGN_IN, SIGN_UP } from './userActions';

export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: App.reducer,
    study: Study.reducer,
    group: Group.reducer,
    user: User.reducer,
  });

export const Actions = {
  ...App.actions,
  ...Group.actions,
  ...Study.actions,
  ...User.actions,
  GROUP_LIST,
  GROUP_DELETE,
  GROUP_STATUS,
  GROUP_WORD_LIST,
  GROUP_WORD_DETAILS,
  GROUP_QUESTION_LIST,
  STUDY_START,
  STUDY_CONTINUE,
  STUDY_IGNORE,
  STUDY_TODOS,
  SIGN_IN,
  SIGN_UP,
};
