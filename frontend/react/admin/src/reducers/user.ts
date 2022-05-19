import { Consts } from '@constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';
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
  // selected student
  activeStudent: '',
};

const slice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    // Sign out
    SIGN_OUT: (state) => {
      state.loginStatus = Consts.SIGN_STATUS.NOT_LOGIN;
    },
    // Sign out
    USER_ACTIVE_STUDENT: (state, { payload }: PayloadAction<string>) => {
      state.activeStudent = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserActions.USER_SIGN_IN.fulfilled, (state, { payload }) => {
        // require mfa code
        if (payload.mfaRequired) {
          state.loginStatus = Consts.SIGN_STATUS.MFA_REQUIRED;
          state.password = payload.password;
        } else if (payload.newPasswordRequired) {
          // require new password
          state.loginStatus = Consts.SIGN_STATUS.NEW_PASSWORD_REQUIRED;
          state.password = payload.password;
        } else if (payload.success === 'true') {
          state.loginStatus = Consts.SIGN_STATUS.LOGINED;
        }

        state.username = payload.username;
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
      .addCase(UserActions.USER_CURRICULUM_ORDER.fulfilled, (state, { payload }) => {
        payload.forEach((item) => {
          const finded = state.curriculums.find((c) => c.id === item.curriculumId);

          if (finded) {
            finded.order = Number(item.order);
          }
        });

        state.curriculums = sortBy(state.curriculums, ['order']);
      })
      .addCase(UserActions.USER_CURRICULUM_LIST.fulfilled, (state, { payload }) => {
        state.curriculums = sortBy(payload.items, ['order']);
      })
      .addCase(UserActions.USER_STUDENT_LIST.fulfilled, (state, { payload }) => {
        state.students = payload.items;

        // 初期化済み
        if (state.activeStudent !== '') return;
        // 生徒なし
        if (payload.items.length === 0) return;

        state.activeStudent = payload.items[0].id;
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
