import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { Consts, Paths, ActionTypes } from '@constants';
import { defaultFailure, startLoading } from '@actions';
import { Actions, APIs } from 'typings';

/** 単語復習 */
export const success = createAction<Actions.B006Payload, APIs.WordItem[]>(
  ActionTypes.B0_06_SUCCESS,
  (data: APIs.WordItem[]) => ({
    mode: Consts.MODES.Review,
    words: data,
  })
);

/** 単語復習 */
const startReview: Actions.StartReviewAction = () => async (dispatch, store, api) => {
  // 既存単語クリア
  dispatch(startLoading());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const { groupId } = store().app;
    const res = await api.get<APIs.C008Response>(Consts.C008_URL(groupId));

    // データ保存
    dispatch(success(res.words));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default startReview;
