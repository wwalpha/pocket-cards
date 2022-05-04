import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './app';
import Study from './study';
import Group from './group';
import User from './user';
import * as GroupActions from './groupActions';
import * as StudyActions from './studyActions';
import * as UserActions from './userActions';
import { Domains } from 'typings';

export default (history: History<any>) =>
  combineReducers<Domains.States>({
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
  ...StudyActions,
  ...GroupActions,
  ...UserActions,
};
