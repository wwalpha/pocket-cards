import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './App';
import Study, { STUDY_START } from './Study';
import Group, { GROUP_LIST, GROUP_DELETE, GROUP_WORD_LIST } from './Group';
import User from './User';

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
  STUDY_START,
};
