import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';

export const history = createHashHistory();

// const rootReducer = (state: any, action: any) => {
//   if (action.type === ActionTypes.RESET_STATE) {
//     state = undefined;
//   }

//   return reducers(state, action);
// };
const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage,
  },
  reducers(history)
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)).concat(logger),
});

if (module.hot) {
  module.hot.accept('../reducers', () => store.replaceReducer(persistedReducer));
}

export default store;
