import { AnyAction, CombinedState, configureStore, Reducer } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory, createBrowserHistory } from 'history';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { Domains } from 'typings';

// browser history
export const history = process.env.NODE_ENV === 'production' ? createBrowserHistory() : createHashHistory();
// storage key
export const key = process.env.NODE_ENV === 'production' ? 'pkc' : 'pkc_dev';

// Credentials.refreshSession = async (accessToken?: string, refreshToken?: string) => {
//   if (!refreshToken) return;

//   const res = await axios.post<Auth.InitiateAuthResponse>(
//     `${Environments.BACKEND_API_URL}${Consts.API_URLs.InitiateAuth}`,
//     {
//       accessToken,
//       refreshToken,
//     } as Auth.InitiateAuthRequest
//   );

//   // error check
//   if (!res.data.idToken || !res.data.accessToken) {
//     throw new Error('Refresh tokens failed.');
//   }

//   return {
//     idToken: res.data.idToken,
//     accessToken: res.data.accessToken,
//   };
// };

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
