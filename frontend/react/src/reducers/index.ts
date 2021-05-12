import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import App from './App';
// import A000 from './A000';
// import Word from './Word';
import User from './User';
import Group from './Group';

export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    app: App,
    // word: Word,
    user: User,
    group: Group,
  });
