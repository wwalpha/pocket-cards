import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './App';
import Study from './Study';
import User from './User';
import Group from './Group';

export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: App,
    study: Study,
    user: User,
    group: Group,
  });
