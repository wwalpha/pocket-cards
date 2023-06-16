import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';
import Study from './study';
import User from './user';
import * as StudyActions from './studyActions';
import * as UserActions from './userActions';
import * as AppActions from './appActions';
import { Domains } from 'typings';

export default (history: History<any>) =>
  combineReducers<Domains.States>({
    router: connectRouter(history),
    app: App.reducer,
    study: Study.reducer,
    user: User.reducer,
  });

export const Actions = {
  ...App.actions,
  ...Study.actions,
  ...User.actions,
  ...StudyActions,
  ...UserActions,
  ...AppActions,
};
