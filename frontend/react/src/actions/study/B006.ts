import { createAction, ActionFunction0, ActionFunction1, Action } from 'redux-actions';
import { push } from 'connected-react-router';
import { Consts, Paths, ActionTypes } from '@constants';
import { C008Response, WordItem } from 'typings/api';
import { State } from '@domains';
import { Payload, ErrorPayload, APIClass } from 'typings/types';
import { ThunkAction } from 'redux-thunk';

/** 単語復習 */
export const request: B006RequestAction = createAction(ActionTypes.B0_06_REQUEST);
export const success: B006SuccessAction = createAction(ActionTypes.B0_06_SUCCESS, (data: WordItem[]) => ({
  mode: Consts.MODES.Review,
  words: data,
}));
export const failure: B006FailureAction = createAction(ActionTypes.B0_06_FAILURE, (error: Error) => ({ error }));

/** 単語復習 */
const startReview: StartReviewAction = () => async (dispatch, store, api) => {
  // 既存単語クリア
  dispatch(request());

  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]));

  try {
    const { groupId } = store().app;
    const res = await api.get<C008Response>(Consts.C008_URL(groupId));

    // データ保存
    dispatch(success(res.words));
  } catch (err) {
    dispatch(failure(err));
  }
};

export interface B006Payload {
  mode: string;
  words: WordItem[];
}
export type B006RequestAction = ActionFunction0<Action<Payload>>;
export type B006SuccessAction = ActionFunction1<WordItem[], Action<B006Payload>>;
export type B006FailureAction = ActionFunction1<Error, Action<ErrorPayload>>;

export type StartReviewPayload = Payload | B006Payload | ErrorPayload;
export type StartReviewThunkAction = ThunkAction<Promise<void>, State, APIClass, Action<StartReviewPayload>>;
export type StartReviewAction = ActionFunction0<StartReviewThunkAction>;

export default startReview;
