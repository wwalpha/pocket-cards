import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import reducers from '../reducers';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

export const history = createBrowserHistory();

const persistedReducer = persistReducer(
  {
    key: 'pkc',
    version: 2,
    storage,
  },
  reducers(history)
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
