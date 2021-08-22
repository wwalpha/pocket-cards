import { Study } from '@domains';
import { handleActions, Action } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<Study, any>(
  {
    /** 新規学習 */
    [ActionTypes.STUDY_START_NEW]: (store: Study, { payload }: Action<Actions.StudyPayload>) => store.setWords(payload),
    /** 単語復習 */
    [ActionTypes.STUDY_START_REVIEW]: (store: Study, { payload }: Action<Actions.StudyPayload>) =>
      store.setWords(payload),
    /** 単語テスト */
    [ActionTypes.STUDY_START_TEST]: (store: Study, { payload }: Action<Actions.StudyPayload>) =>
      store.setWords(payload),
    /** テスト回答(YES/NO) */
    [ActionTypes.STUDY_ANSWER]: (store: Study, { payload: { yes } }: Action<Actions.StudyAnswerPayload>) =>
      store.answer(yes),

    /** 次の単語 */
    // [ActionTypes.STUDY_NEXT]: (store: Study) => store.next(),
  },
  new Study()
);

export default reducer;
