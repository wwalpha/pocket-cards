import { push } from 'connected-react-router';
import { Consts, ROUTE_PATHS } from '@constants';
import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

/** テスト回答(YES/NO) */
export const answer = (correct: boolean) => (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_ANSWER(correct)).then(() => {
    dispatch(Actions.STUDY_CONTINUE());
  });
};

/** 新規単語学習 */
export const startPractice = () => async (dispatch: AppDispatch) => {
  // 学習初期化
  dispatch(Actions.STUDY_INIT(Consts.MODES.Practice));
  // 新規単語の学習開始
  await dispatch(Actions.STUDY_PRACTICE()).unwrap();
  // 画面遷移
  dispatch(push(ROUTE_PATHS.STUDY_CARD));
};

/** 新規単語テスト */
export const startTest = () => async (dispatch: AppDispatch) => {
  // 学習初期化
  dispatch(Actions.STUDY_INIT(Consts.MODES.Test));
  // 新規単語の学習開始
  await dispatch(Actions.STUDY_TEST()).unwrap();
  // 画面遷移
  dispatch(push(ROUTE_PATHS.STUDY_CARD));
};
