import { Word } from '@domains';
import { handleActions, Action } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<Word, any>(
  {
    /** 新規単語 */
    [ActionTypes.B0_01_REQUEST]: (store: Word) => store.clear(),
    [ActionTypes.B0_01_SUCCESS]: (store: Word, { payload: { mode, words } }: Action<Actions.B001Payload>) =>
      store.setWords(mode, words),
    // [ActionTypes.B0_01_FAILURE]: (store: Word) => store.endLoading(),

    /** 次の単語 */
    // [B0_02_REQUEST]: (store: B000) => store,
    // [B0_02_SUCCESS]: (store: B000) => store.next(),
    // [B0_02_FAILURE]: (store: B000) => store,

    /** 単語セットのリトライ */
    // [B0_03_REQUEST]: (store: B000) => store,
    // [B0_03_SUCCESS]: (store: B000) => store.retry(),
    // [B0_03_FAILURE]: (store: B000) => store,

    /** テスト回答(YES/NO) */
    [ActionTypes.B0_04_SUCCESS]: (store: Word, { payload: { yes } }: Action<Actions.B004Payload>) => store.answer(yes),

    /** 単語テスト（当日） */
    // [B0_05_REQUEST]: (store: B000) => store,
    // [B0_05_SUCCESS]: (store: B000, { payload: { mode, words } }: Action<B005_SUCCESS_PAYLOAD>) => store.setWords(mode, words),
    // [B0_05_FAILURE]: (store: B000) => store,

    /** 単語復習 */
    [ActionTypes.B0_06_REQUEST]: (store: Word) => store.clear(),
    [ActionTypes.B0_06_SUCCESS]: (store: Word, { payload: { mode, words } }: Action<Actions.B006Payload>) =>
      store.setWords(mode, words),

    /** 単語テスト */
    [ActionTypes.B0_07_REQUEST]: (store: Word) => store.clear(),
    [ActionTypes.B0_07_SUCCESS]: (store: Word, { payload: { mode, words } }: Action<Actions.B007Payload>) =>
      store.setWords(mode, words),
  },
  new Word()
);

export default reducer;
