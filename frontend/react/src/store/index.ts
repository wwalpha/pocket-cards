const store = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev');
  }
  return require('./prod');
})();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const history = process.env.NODE_ENV !== 'production' ? require('./dev').history : require('./prod').history;
