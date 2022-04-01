import { Consts } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@utils';
import { Auth } from 'typings';

export const SIGN_IN = createAsyncThunk<Auth.SignInResponse & Auth.SignInRequest, Auth.SignInRequest>(
  'app/SIGN_IN',
  async (request) => {
    const res = await API.post<Auth.SignInRequest, Auth.SignInResponse>(Consts.AUTH_LOGIN(), request);

    return {
      ...res,
      username: request.username,
      password: request.password,
    };
  }
);
