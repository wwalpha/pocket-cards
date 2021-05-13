import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(ActionTypes.APP_01_SUCCESS, (index: number): Actions.TabChangePayload => ({ index }));

/** タブ変更 */
export const tabChange: Actions.TabChangeAction = (index: number) => async (dispatch, _, api) => {
  dispatch(success(index));
};
