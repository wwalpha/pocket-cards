import { createAction } from 'redux-actions';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import * as StartNew from './startNew';
import * as StartTest from './startTest';
import { API, Actions } from 'typings';

const success = createAction(ActionTypes.B0_04_SUCCESS, (yes: boolean) => ({ yes }));

/** テスト回答(YES/NO) */
const answer: Actions.AnswerAction = (word: string, yes: boolean) => async (dispatch, store, api) => {
  const { mode, current, rows } = store().word;
  const { groupId } = store().app;

  // Request start
  dispatch(startLoading());

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

  try {
    // 正解の場合、現在の回数、不正解の場合は0に戻ります
    const times = yes ? current.times : 0;

    // 単語状態を設定する
    updateStatus(api, groupId, word, yes, times);
    // Client状態管理
    dispatch(success(yes));

    // 一定数以上の場合、再取得しない
    if (rows.length > 5) {
      return;
    }

    // 0.1秒待ち
    await sleep(100);

    // 新規の場合
    if (mode === Consts.MODES.New) {
      const res = await api.get<API.C006Response>(Consts.C006_URL(groupId));

      // 新規単語の追加
      // TODO:!!!
      //@ts-ignore
      dispatch(StartNew.success(res.words));
    } else {
      // テストの場合
      const res = await api.get<API.C007Response>(Consts.C007_URL(groupId));

      // TODO:!!!
      //@ts-ignore
      dispatch(StartTest.success(res.words));
    }
  } catch (error) {
    dispatch(defaultFailure(error));
    // dispatch(StartNew.failure(error));
  }
};

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const updateStatus = async (api: API.APIClass, groupId: string, word: string, yes: boolean, times: number) => {
  await api.put(Consts.C004_URL(groupId, word), {
    type: '1',
    correct: yes,
    times,
  } as API.C004Request);
};

export default answer;
