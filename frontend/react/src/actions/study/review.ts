import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { Consts, Paths, ActionTypes } from '@constants';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { Actions, APIs } from 'typings';

/** 単語復習 */
export const success = createAction<Actions.StudyPayload, APIs.C008Response>(
  ActionTypes.STUDY_START_REVIEW,
  (datas: APIs.C008Response) => ({
    mode: Consts.MODES.Review,
    datas,
  })
);

/** 単語復習 */
const startReview: Actions.StudyReviewAction = () => async (dispatch, store, api) => {
  const { groupId } = store().app;

  // 既存単語クリア
  dispatch(startLoading());

  try {
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

    const res = await api.get<APIs.C008Response>(Consts.C008_URL(groupId));

    // データ保存
    dispatch(success(res));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default startReview;
