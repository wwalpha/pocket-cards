import { Consts } from '@constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API, Credentials } from '@utils';
import { Auth, Users, APIs } from 'typings';

export const USER_SIGN_IN = createAsyncThunk<Auth.SignInResponse & Auth.SignInRequest, Auth.SignInRequest>(
  'user/USER_SIGN_IN',
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

export const USER_SIGN_UP = createAsyncThunk<Users.CreateUserResponse, Users.CreateUserRequest>(
  'user/USER_SIGN_UP',
  async (request) => {
    return await API.post<Users.CreateUserRequest, Users.CreateUserResponse>(Consts.SIGN_UP(), request);
  }
);

export const USER_CURRICULUM_REGIST = createAsyncThunk<APIs.CurriculumRegistResponse, APIs.CurriculumRegistRequest>(
  'user/USER_CURRICULUM_REGIST',
  async (request) => {
    return await API.put<APIs.CurriculumRegistResponse, APIs.CurriculumRegistRequest>(
      Consts.CURRICULUM_REGIST(),
      request
    );
  }
);

export const USER_CURRICULUM_REMOVE = createAsyncThunk<string, string>(
  'user/USER_CURRICULUM_REMOVE',
  async (curriculumId) => {
    await API.del(Consts.CURRICULUM_REMOVE(curriculumId));

    return curriculumId;
  }
);

export const USER_CURRICULUM_LIST = createAsyncThunk<APIs.CurriculumListsResponse, void>(
  'user/USER_CURRICULUM_LIST',
  async () => {
    return await API.get<APIs.CurriculumListsResponse>(Consts.CURRICULUM_LIST());
  }
);

export const USER_STUDENTS_LIST = createAsyncThunk<Users.GetStudentResponse, void>(
  'user/USER_STUDENTS_LIST',
  async () => {
    return await API.get<Users.GetStudentResponse>(Consts.STUDENT_LIST());
  }
);
