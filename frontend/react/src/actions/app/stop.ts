import { createAction } from 'redux-actions';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions } from 'typings';

const success = createAction(
  ActionTypes.APP_07_SUCCESS,
  (status: string): Actions.ServerStopPayload => ({
    status,
  })
);

/** サーバー停止 */
export const stop: Actions.ServerStopAction = () => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    // サーバ停止
    const res = await api.post(Consts.SERVER_STOP_URL());

    dispatch(success(res.status));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
