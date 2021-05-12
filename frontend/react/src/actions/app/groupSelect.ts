import { createAction } from 'redux-actions';
import { defaultRequest, defaultFailure } from '@actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction(
  ActionTypes.APP_09_SUCCESS,
  (groupId: string): Actions.App09Payload => ({
    groupId,
  })
);

/** グループ選択 */
export const groupSelect: Actions.GroupSelectAction = (groupId: string) => async (dispatch, _, api) => {
  dispatch(defaultRequest());

  try {
    dispatch(success(groupId));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
