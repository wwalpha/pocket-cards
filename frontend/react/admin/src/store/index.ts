import axios from 'axios';
import { AnyAction, CombinedState, configureStore, Reducer } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory, createBrowserHistory } from 'history';
import logger from 'redux-logger';
import { Credentials } from '@utils';
import { URLs } from '@constants';
import WebSocket from '../middleware/WebSocket';
import { Auth, Domains } from 'typings';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

// browser history
export const history = process.env.NODE_ENV === 'production' ? createBrowserHistory() : createHashHistory();
// storage key
export const key = process.env.NODE_ENV === 'production' ? 'pkc' : 'pkc_dev';

axios.defaults.baseURL = process.env.API_URL;

Credentials.refreshSession = async (accessToken?: string, refreshToken?: string) => {
  if (!refreshToken || !accessToken) return;

  const res = await axios.create().post<Auth.InitiateAuthResponse>(URLs.REFRESH_TOKEN(), {
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  if (res.status !== 200) {
    throw new Error('Refresh tokens failed.');
  }

  return {
    idToken: res.data.idToken,
    accessToken: res.data.accessToken,
  };
};

// const persistedReducer = persistReducer(
//   {
//     key: key,
//     version: 3,
//     storage,
//   },
//   reducers(history)
// );

const rootReducer: Reducer<CombinedState<Domains.States>, AnyAction> = (state, action) => {
  if (action.type === 'app/APP_LOGOUT') {
    state = undefined;
  }

  const reducers = require('../reducers');

  return reducers.default(history)(state, action);
};

const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    let middle = getDefaultMiddleware();

    middle = middle.concat(routerMiddleware(history));
    middle = middle.concat(WebSocket);

    if (process.env.NODE_ENV !== 'production') {
      middle = middle.concat(logger);
    }

    return middle;
  },
});

if (module.hot) {
  module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  // module.hot.accept('../reducers', () => store.replaceReducer(persistedReducer));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
