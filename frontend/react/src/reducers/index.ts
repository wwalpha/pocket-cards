import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';
import Study, { STUDY_START } from './study';
import Group from './group';
import User from './user';
import { GROUP_LIST, GROUP_DELETE, GROUP_WORD_LIST, GROUP_WORD_DETAILS } from './groupActions';

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
  GROUP_WORD_LIST,
  GROUP_WORD_DETAILS,
  STUDY_START,
};
