import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { Consts, Paths, ActionTypes } from '@constants';
import { APIs, Actions } from 'typings';

/** 単語テスト */
export const success = createAction<Actions.StudyPayload, APIs.C007Response>(
  ActionTypes.STUDY_START_TEST,
  (datas: APIs.C007Response) => ({
    mode: Consts.MODES.AllTest,
    datas,
  })
);

/** 単語テスト */
const startTest: Actions.StudyTestAction = () => async (dispatch, store, api) => {
  // 既存単語クリア
  dispatch(startLoading());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const { groupId } = store().app;
    const res = await api.get<APIs.C007Response>(Consts.C007_URL(groupId));

    // データ保存
    dispatch(success(res));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default startTest;
