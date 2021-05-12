import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { defaultFailure, defaultRequest } from '@actions';
import { Consts, Paths, ActionTypes } from '@constants';
import { API, Actions } from 'typings';

/** 単語テスト */
export const success = createAction(ActionTypes.B0_07_SUCCESS, (data: API.WordItem[]) => ({
  mode: Consts.MODES.AllTest,
  words: data,
}));

/** 単語テスト */
const startTest: Actions.StartTestAction = () => async (dispatch, store, api) => {
  // 既存単語クリア
  dispatch(defaultRequest());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const { groupId } = store().app;
    const res = await api.get<API.C007Response>(Consts.C007_URL(groupId));

    // データ保存
    dispatch(success(res.words));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default startTest;
