import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { Consts, Paths, ActionTypes } from '@constants';
import { defaultFailure, defaultRequest } from '@actions';
import { APP, API } from 'typings';

/** 単語復習 */
export const success = createAction<APP.B006Payload, API.WordItem[]>(
  ActionTypes.B0_06_SUCCESS,
  (data: API.WordItem[]) => ({
    mode: Consts.MODES.Review,
    words: data,
  })
);

/** 単語復習 */
const startReview: APP.StartReviewAction = () => async (dispatch, store, api) => {
  // 既存単語クリア
  dispatch(defaultRequest());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const { groupId } = store().app;
    const res = await api.get<API.C008Response>(Consts.C008_URL(groupId));

    // データ保存
    dispatch(success(res.words));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default startReview;
