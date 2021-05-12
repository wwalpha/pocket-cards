import { createAction } from 'redux-actions';
import { defaultRequest, defaultFailure } from '@actions';
import { ActionTypes, Consts } from '@constants';
import { Actions } from 'typings';

const success = createAction(
  ActionTypes.APP_06_SUCCESS,
  (status: string): Actions.ServerStartPayload => ({
    status,
  })
);

/** サーバー開始 */
export const start: Actions.ServerStartAction = () => async (dispatch, _, api) => {
  dispatch(defaultRequest());

  try {
    const res = await api.post(Consts.SERVER_START_URL());

    dispatch(success(res.status));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
