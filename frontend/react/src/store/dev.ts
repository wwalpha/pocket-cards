import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import logger from 'redux-logger';
import reducers from '../reducers';

export const history = createHashHistory();

// const rootReducer = (state: any, action: any) => {
//   if (action.type === ActionTypes.RESET_STATE) {
//     state = undefined;
//   }

//   return reducers(state, action);
// };

const store = configureStore({
  reducer: reducers(history),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)).concat(logger),
});

if (module.hot) {
  module.hot.accept('../reducers', () => store.replaceReducer(reducers(history)));
}

export default store;
