import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { startLoading, defaultFailure } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { App, Actions, APIs } from 'typings';

const success = createAction(ActionTypes.A0_03_SUCCESS);

/** 単語登録 */
export const registWords: Actions.RegistWordsAction = (words: string[]) => async (dispatch, store, api) => {
  const { groupId } = store().app;

  try {
    // 画像アップロード開始イベント
    dispatch(startLoading());

    await api.post(Consts.C001_URL(groupId), {
      words,
    } as APIs.C001Request);

    // 単語リスト再取得する
    // TODO: !!!!
    // dispatch(Actions.list(groupId));
    // データ保存
    dispatch(success());
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistFinish]));
  }
};
