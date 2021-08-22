import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { Actions, APIs } from 'typings';

export const success = createAction<Actions.StudyPayload, APIs.C006Response>(
  ActionTypes.STUDY_START_NEW,
  (datas: APIs.C006Response) => ({
    mode: Consts.MODES.New,
    datas,
  })
);

/** 新規単語学習 */
const startNew: Actions.StudyNewAction = () => async (dispatch, store, api) => {
  const { groupId } = store().app;

  // 既存単語クリア
  dispatch(startLoading());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const res = await api.get<APIs.C006Response>(Consts.C006_URL(groupId));

    // データ保存
    dispatch(success(res));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default startNew;
