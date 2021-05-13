import { createAction } from 'redux-actions';
import { startLoading, defaultFailure, endLoading } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions } from 'typings';
import { list } from '../group';

const success = createAction(
  ActionTypes.APP_08_SUCCESS,
  (status: string): Actions.ServerStatusPayload => ({
    status,
  })
);

/** サーバーステータス */
export const status: Actions.ServerStatusAction = () => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    // サーバ停止
    const res = await api.get(Consts.SERVER_STATUS_URL());

    if (res.status === Consts.SERVER_STATUS.RUNNING) {
      dispatch(list());
    }

    dispatch(success(res.status));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
