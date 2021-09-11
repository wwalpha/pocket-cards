import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import * as StartNew from './new';
import * as StartTest from './test';
import { APIs, Actions, APIClass } from 'typings';

const success = createAction<Actions.StudyAnswerPayload, boolean>(ActionTypes.STUDY_ANSWER, (yes: boolean) => ({
  yes,
}));

/** テスト回答(YES/NO) */
const answer: Actions.StudyAnswerAction = (word: string, yes: boolean) => async (dispatch, store, api) => {
  const { mode, current, rows } = store().study;
  const { groupId } = store().app;

  // Request start
  dispatch(startLoading());

  try {
    // 復習モードの場合、サーバ更新しない
    if (mode === Consts.MODES.Review) {
      dispatch(success(yes));
      return;
    }

    // 新規学習モードの場合、不正解の場合、更新しない
    if (mode === Consts.MODES.New && !yes) {
      dispatch(success(yes));
      return;
    }

    // データなしの場合、処理しない
    if (!current) return;

    // 正解の場合、現在の回数、不正解の場合は0に戻ります
    const times = yes ? current.times : 0;

    // 単語状態を設定する
    updateStatus(api, groupId, word, yes, times);
    // Client状態管理
    dispatch(success(yes));

    // 一定数以上の場合、再取得しない
    if (rows.length > 3) {
      return;
    }

    // 0.1秒待ち
    await sleep(100);

    // 新規の場合
    if (mode === Consts.MODES.New) {
      const res = await api.get<APIs.C006Response>(Consts.C006_URL(groupId));

      // 新規単語の追加
      dispatch(
        StartNew.success({
          count: res.count,
          words: res.words,
        })
      );
    } else {
      // テストの場合
      const res = await api.get<APIs.C007Response>(Consts.C007_URL(groupId));

      dispatch(
        StartTest.success({
          count: res.count,
          words: res.words,
        })
      );
    }
  } catch (error) {
    dispatch(defaultFailure(error));
  } finally {
    dispatch(endLoading());
  }
};

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const updateStatus = async (api: APIClass, groupId: string, word: string, yes: boolean, times: number) => {
  await api.put(Consts.C004_URL(groupId, word), {
    type: '1',
    correct: yes,
    times,
  } as APIs.C004Request);
};

export default answer;
