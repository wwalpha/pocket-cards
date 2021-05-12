import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { defaultRequest, defaultFailure } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { APP, API } from 'typings';

export const success = createAction(ActionTypes.B0_01_SUCCESS, (data: API.WordItem[]) => ({
  mode: Consts.MODES.New,
  words: data,
}));

/** 新規単語学習 */
const startNew: APP.StartNewAction = () => async (dispatch, store, api) => {
  const { groupId } = store().app;

  // 既存単語クリア
  dispatch(defaultRequest());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const res = await api.get<API.C006Response>(Consts.C006_URL(groupId));

    // データ保存
    dispatch(success(res.words));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default startNew;
