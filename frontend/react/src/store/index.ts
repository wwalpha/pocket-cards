const store = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev').default;
  }
  return require('./prod').default;
})();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
