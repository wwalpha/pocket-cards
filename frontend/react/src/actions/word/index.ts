import { ThunkActionDispatch } from 'typings/redux-thunk';
import { default as list } from './list';

// ------------------------------
// TypeScript Definetion
// ------------------------------
export interface WordActions {
  /** 単語リスト取得 */
  list(): ThunkActionDispatch<typeof list>;
}
