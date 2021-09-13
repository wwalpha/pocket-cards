import dev from './dev';
import prod from './prod';

const store = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return dev;
  }
  return prod;
})();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const history = process.env.NODE_ENV !== 'production' ? require('./dev').history : require('./prod').history;
