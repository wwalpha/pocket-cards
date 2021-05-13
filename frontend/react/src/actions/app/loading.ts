import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction<Actions.LoadingPayload, boolean>(ActionTypes.COM_01_SUCCESS, (isLoading) => ({
  isLoading,
}));

/** Set Loading Status */
export const loading: Actions.LoadingAction = (isLoading) => async (dispatch) => {
  // set loading status
  dispatch(success(isLoading));
};
