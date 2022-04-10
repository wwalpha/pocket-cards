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

export const USER_STUDENT_REGIST = createAsyncThunk<Users.CreateStudentResponse, Users.CreateStudentRequest>(
  'user/USER_STUDENT_REGIST',
  async (request) => {
    return await API.post<Users.CreateStudentResponse, Users.CreateStudentRequest>(Consts.STUDENT_REGIST(), request);
  }
);

export const USER_INFORMATIONS = createAsyncThunk<Users.DescribeUserResponse, void>(
  'user/USER_INFORMATIONS',
  async (_, { getState }) => {
    const { username } = (getState() as RootState).user;

    return await API.get<Users.DescribeUserResponse>(Consts.DESCRIBE_USER(username));
  }
);

export const USER_UPDATE_NOTIFICATIONS = createAsyncThunk<string[] | undefined, Users.UpdateUserRequest>(
  'user/USER_UPDATE_NOTIFICATIONS',
  async (request, { getState }) => {
    const { username } = (getState() as RootState).user;

    // update
    await API.put<Users.UpdateUserResponse, Users.UpdateUserRequest>(Consts.UPDATE_USER(username), request);

    return request.notifications;
  }
);
