// const store = (() => {
//   if (process.env.NODE_ENV !== 'production') {
//     return require('./dev').default;
//   }
//   return require('./prod').default;
// })();

// export default store;

// export { AppDispatch, RootState } from './prod';

// export const history = process.env.NODE_ENV !== 'production' ? require('./dev').history : require('./prod').history;

import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory, createBrowserHistory } from 'history';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import reducers from '../reducers';

console.log(process.env);

export const history = process.env.NODE_ENV === 'production' ? createBrowserHistory() : createHashHistory();
export const key = process.env.NODE_ENV === 'production' ? 'pkc' : 'pkc_dev';

const persistedReducer = persistReducer(
  {
    key: key,
    version: 3,
    storage,
  },
  reducers(history)
);

const store = configureStore({
  reducer: persistedReducer,
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
  module.hot.accept('../reducers', () => store.replaceReducer(persistedReducer));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
