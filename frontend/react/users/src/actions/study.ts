import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Consts, ROUTE_PATHS } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { APIs, AppDispatch, RootState } from 'typings';

/** テスト回答(YES/NO) */
export const answer = (word: string, yes: boolean) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async (state: RootState) => {
      const { mode, current, rows } = state.study;

      // 新規学習モードの場合、不正解の場合、更新しない
      if (mode === Consts.MODES.Practice && !yes) {
        dispatch(Actions.STUDY_ANSWER(yes));
        return;
      }

      // データなしの場合、処理しない
      if (!current) return;

      const activeGroup = current.groupId;
      // 正解の場合、現在の回数、不正解の場合は0に戻ります
      const times = yes ? current.times : 0;

      // 単語状態を設定する
      updateStatus(activeGroup, word, yes, times);
      // Client状態管理
      dispatch(Actions.STUDY_ANSWER(yes));

      // 一定数以上の場合、再取得しない
      if (rows.length > Consts.STUDY_BUFFER_LOWER_LIMIT) {
        return;
      }

      // 0.1秒待ち
      await sleep(100);

      // 単語の追加
      dispatch(Actions.STUDY_CONTINUE());
    })
  );

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const updateStatus = async (groupId: string, word: string, yes: boolean, times: number) => {
  await API.put(Consts.C004_URL(groupId, word), {
    type: '1',
    correct: yes,
    times,
  } as APIs.C004Request);
};

/** 新規単語/復習/テスト */
export const startStudy = (mode: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // 画面遷移
      dispatch(push(ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.StudyCard]));
      // 新規単語の学習開始
      dispatch(Actions.STUDY_START(mode));
    })
  );

/** 新規単語学習 */
export const startPractice = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // 画面遷移
      dispatch(push(ROUTE_PATHS.STUDY_CARD));
      // 新規単語の学習開始
      dispatch(Actions.STUDY_START(Consts.MODES.Practice));
    })
  );

/** 新規単語テスト */
export const startTest = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // 画面遷移
      dispatch(push(ROUTE_PATHS.STUDY_CARD));
      // 新規単語の学習開始
      dispatch(Actions.STUDY_START(Consts.MODES.Practice));
    })
  );

/** 新規単語/復習/テスト */
export const startTodos = (mode: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // 画面遷移
      dispatch(push(ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.StudyCard]));
      // 新規単語の学習開始
      dispatch(Actions.STUDY_TODOS(mode));
    })
  );
