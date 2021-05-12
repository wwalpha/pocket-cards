import { ThunkActionDispatch } from 'typings/redux-thunk';
import { default as list } from './list';
import { default as delet } from './delete';
import { default as deleteRow } from './deleteRow';
import { default as detail } from './detail';

export { default as list } from './list';
export { default as delet } from './delete';
export { default as deleteRow } from './deleteRow';
export { default as detail } from './detail';

// ------------------------------------------------------------
// TypeScript Definetion
// ------------------------------------------------------------
export interface Actions {
  /** 単語リスト取得 */
  list(): ThunkActionDispatch<typeof list>;
}
