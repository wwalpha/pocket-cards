import { Consts } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Credentials } from '../index';
import { API } from '@utils';
import { Auth, Users } from 'typings';

export const SIGN_IN = createAsyncThunk<Auth.SignInResponse & Auth.SignInRequest, Auth.SignInRequest>(
  'user/SIGN_IN',
  async (request) => {
    const res = await API.post<Auth.SignInRequest, Auth.SignInResponse>(Consts.SIGN_IN(), request);

    if (res.idToken && res.accessToken && res.refreshToken) {
      Credentials.setUsername(request.username);
      Credentials.setTokens({
        idToken: res.idToken as string,
        accessToken: res.accessToken as string,
        refreshToken: res.refreshToken,
      });
    }

    return {
      ...res,
      username: request.username,
      password: request.password,
    };
  }
);

export const SIGN_UP = createAsyncThunk<Users.CreateUserResponse, Users.CreateUserRequest>(
  'user/SIGN_UP',
  async (request) => {
    return await API.post<Users.CreateUserRequest, Users.CreateUserResponse>(Consts.SIGN_UP(), request);
  }
);
