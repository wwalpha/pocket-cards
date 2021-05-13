import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';
import * as Word from './word';

/** Common Request Actions */
export const request = (actionType: string): Actions.RequestAction => createAction(actionType);
/** Common Failure Actions */
export const failure = (actionType: string): Actions.FailureAction =>
  createAction(actionType, (error: Error) => ({ error }));

/** default request action */
export const startLoading = request(ActionTypes.COM_01_SUCCESS);
export const endLoading = request(ActionTypes.COM_02_SUCCESS);

/** default failure action */
export const defaultFailure = failure(ActionTypes.COM_01_FAILURE);

export default {
  Word,
};
