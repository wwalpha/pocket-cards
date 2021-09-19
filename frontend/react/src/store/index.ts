const store = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev').default;
  }
  return require('./prod').default;
})();

export default store;

export { AppDispatch, RootState } from './dev';
