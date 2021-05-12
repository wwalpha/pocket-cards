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
export const defaultRequest = request(ActionTypes.COM_01_REQUEST);
/** default failure action */
export const defaultFailure = failure(ActionTypes.COM_01_REQUEST);

export default {
  Word,
};
