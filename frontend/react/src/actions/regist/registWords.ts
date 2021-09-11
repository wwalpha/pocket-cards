import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, APIs } from 'typings';

const success = createAction<void>(ActionTypes.REGIST_SUCCESS_REGIST);

/** 単語登録 */
export const registWords: Actions.RegistWordsAction = (words: string[]) => async (dispatch, store, api) => {
  const { groupId } = store().app;

  try {
    // 単語登録イベント開始
    dispatch(startLoading());

    for (; words.length > 0; ) {
      const unit = words.length > 100 ? 100 : words.length;
      const items = words.splice(0, unit);

      await api.post(Consts.C001_URL(groupId), {
        words: items,
      } as APIs.C001Request);
    }

    // データ保存
    dispatch(success());
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistFinish]));

    dispatch(endLoading());
  }
};
