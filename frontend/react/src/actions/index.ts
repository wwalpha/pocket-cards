import { createAction } from 'redux-actions';
import { ActionTypes } from '@constants';
import { FailureAction, RequestAction } from 'typings';

/** Common Request Actions */
export const request = (actionType: string): RequestAction => createAction(actionType);
/** Common Failure Actions */
export const failure = (actionType: string): FailureAction => createAction(actionType, (error: Error) => ({ error }));

/** default request action */
export const startLoading = request(ActionTypes.COM_01_SUCCESS);
export const endLoading = request(ActionTypes.COM_02_SUCCESS);

/** default failure action */
export const defaultFailure = failure(ActionTypes.COM_01_FAILURE);

export * as AppActions from './app';
export * as GroupActions from './group';
export * as MypageActions from './mypage';
export * as RegistActions from './regist';
export * as StudyActions from './study';
export * as WordActions from './word';
