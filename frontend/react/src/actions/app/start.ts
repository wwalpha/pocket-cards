import { createAction } from 'redux-actions';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions } from 'typings';

const success = createAction(
  ActionTypes.APP_SUCCESS_SERVER_START,
  (status: string): Actions.ServerStartPayload => ({
    status,
  })
);

/** サーバー開始 */
export const start: Actions.ServerStartAction = () => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    const res = await api.post(Consts.SERVER_START_URL());

    dispatch(success(res.status));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
