import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading, GroupActions } from '@actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const success = createAction<Actions.GroupSelectPayload, string>(
  ActionTypes.APP_SUCCESS_GROUP_SELECT,
  (groupId: string): Actions.GroupSelectPayload => ({
    groupId,
  })
);

/** グループ選択 */
export const groupSelect: Actions.GroupSelectAction = (groupId: string) => async (dispatch) => {
  dispatch(startLoading());

  try {
    dispatch(success(groupId));

    dispatch(GroupActions.words(groupId));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
