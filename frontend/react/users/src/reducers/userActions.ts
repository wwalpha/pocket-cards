import { Consts } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API, Credentials } from '@utils';
import { Auth, Users, APIs, RootState } from 'typings';

export const USER_SIGN_IN = createAsyncThunk<Auth.SignInResponse & Auth.SignInRequest, Auth.SignInRequest>(
  'user/USER_SIGN_IN',
  async (request) => {
    const res = await API.post<Auth.SignInResponse, Auth.SignInRequest>(Consts.SIGN_IN(), request);

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

export const USER_SIGN_UP = createAsyncThunk<Users.CreateUserResponse, Users.CreateUserRequest>(
  'user/USER_SIGN_UP',
  async (request) => {
    return await API.post<Users.CreateUserResponse, Users.CreateUserRequest>(Consts.SIGN_UP(), request);
  }
);
