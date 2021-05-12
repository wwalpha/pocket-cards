import { createAction } from 'redux-actions';
import { defaultRequest, defaultFailure } from '@actions';
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
  dispatch(defaultRequest());

  try {
    // サーバ停止
    const res = await api.post(Consts.SERVER_STOP_URL());

    dispatch(success(res.status));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
