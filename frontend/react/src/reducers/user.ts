import { Consts } from '@constants';
import { createSlice } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as UserActions from './userActions';

const userState: Domains.UserState = {
  // login status: Not login
  loginStatus: Consts.SIGN_STATUS.NOT_LOGIN,
  // user name
  username: '',
  // curriculums
  curriculums: [],
  // students
  students: [],
};

const slice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    // Sign out
    SIGN_OUT: (state) => {
      state.loginStatus = Consts.SIGN_STATUS.NOT_LOGIN;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserActions.USER_SIGN_IN.fulfilled, (state, { payload }) => {
        // require mfa code
        if (payload.mfaRequired) {
          state.loginStatus = Consts.SIGN_STATUS.MFA_REQUIRED;
        } else if (payload.newPasswordRequired) {
          // require new password
          state.loginStatus = Consts.SIGN_STATUS.NEW_PASSWORD_REQUIRED;
        } else if (payload.success === 'true') {
          state.loginStatus = Consts.SIGN_STATUS.LOGINED;
        }

        state.username = payload.username;
        state.password = payload.password;
        state.authority = payload.authority;
      })
      .addCase(UserActions.USER_SIGN_UP.fulfilled, (state, { payload }) => {
        console.log('SIGN UP Success');
      })
      .addCase(UserActions.USER_CURRICULUM_REGIST.fulfilled, (state, { payload }) => {
        state.curriculums.push(payload);
      })
      .addCase(UserActions.USER_CURRICULUM_REMOVE.fulfilled, (state, { payload }) => {
        state.curriculums = state.curriculums.filter((item) => item.id !== payload);
      })
      .addCase(UserActions.USER_CURRICULUM_LIST.fulfilled, (state, { payload }) => {
        state.curriculums = payload.items;
      })
      .addCase(UserActions.USER_STUDENTS_LIST.fulfilled, (state, { payload }) => {
        state.students = payload.items;
      })
      .addCase(UserActions.USER_INFORMATIONS.fulfilled, (state, { payload }) => {
        state.infos = payload;
      })
      .addCase(UserActions.USER_UPDATE_NOTIFICATIONS.fulfilled, (state, { payload }) => {
        if (state.infos) {
          state.infos.notification = payload;
        }
      });
  },
});

export default slice;
