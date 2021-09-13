import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import logger from 'redux-logger';
import reducers from '../reducers';
import { configureStore } from '@reduxjs/toolkit';

export const history = createBrowserHistory();

const store = configureStore({
  reducer: reducers(history),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)).concat(logger),
});

export default store;
