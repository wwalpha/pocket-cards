import { Consts } from '@constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';
import { Domains, QuestionForm } from 'typings';
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
  // inquiries
  inquiries: [],
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
    // Sign out
    USER_INQUIRY_UPDATE: (state, { payload }: PayloadAction<QuestionForm>) => {
      const index = state.inquiries.findIndex((item) => item.id === payload.id);

      // not found
      if (index === -1) {
        return;
      }

      const inquiry = state.inquiries[index];

      // 問題
      inquiry.title = payload.title;
      // 解答
      inquiry.answer = payload.answer;
      // コメント
      inquiry.description = payload.description;

      state.inquiries[index] = inquiry;
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
        // カリキュラム新規登録
        state.curriculums.unshift(payload);
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
        // ユーザ情報一覧
        state.infos = payload;
      })
      .addCase(UserActions.USER_UPDATE_NOTIFICATIONS.fulfilled, (state, { payload }) => {
        // ユーザ情報更新
        if (state.infos) {
          state.infos.notification = payload;
        }
      })
      .addCase(UserActions.USER_INQUIRY_LIST.fulfilled, (state, { payload }) => {
        // 問い合わせ一覧
        state.inquiries = payload;
      })
      .addCase(UserActions.USER_INQUIRY_REMOVE.fulfilled, (state, { payload }) => {
        // 問い合わせ削除
        state.inquiries = state.inquiries.filter((item) => item.id !== payload);
      });
  },
});

export default slice;
