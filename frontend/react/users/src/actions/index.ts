import { Actions } from '@reducers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const startLoading = Actions.APP_START_LOADING;
export const endLoading = Actions.APP_END_LOADING;
export const defaultFailure = Actions.APP_COM_01_FAILURE;

export const withLoading = createAsyncThunk('app/Loading', async (func: Function, { dispatch, getState }) => {
  const state = getState();

  dispatch(startLoading());

  try {
    await func(state);
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
});

export * as AppActions from './app';
export * as GroupActions from './group';
export * as RegistActions from './regist';
export * as StudyActions from './study';
export * as WordActions from './word';
export * as UserActions from './user';
export * as AdminActions from './admin';
export * as QuestionActions from './questions';
