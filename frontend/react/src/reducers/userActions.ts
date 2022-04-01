import { Consts } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@utils';
import { Auth, Users } from 'typings';

export const SIGN_IN = createAsyncThunk<Auth.SignInResponse & Auth.SignInRequest, Auth.SignInRequest>(
  'user/SIGN_IN',
  async (request) => {
    const res = await API.post<Auth.SignInRequest, Auth.SignInResponse>(Consts.SIGN_IN(), request);

    return {
      ...res,
      username: request.username,
      password: request.password,
    };
  }
);

export const SIGN_UP = createAsyncThunk<void, Users.CreateUserRequest>('user/SIGN_UP', async (request) => {
  await API.post<Users.CreateUserRequest, Users.CreateUserResponse>(Consts.SIGN_UP(), request);
});
