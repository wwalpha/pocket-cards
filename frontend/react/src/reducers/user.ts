import { Consts } from '@constants';
import { createSlice } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import { SIGN_IN, SIGN_UP } from './userActions';

const userState: Domains.UserState = {
  // login status: Not login
  loginStatus: Consts.SIGN_STATUS.NOT_LOGIN,
  // user name
  username: '',
  // tokens
  tokens: {},
  // details: undefined,
  // remainingTest: 0,
  // remainingReview: 0,
  // daily: 0,
  // dailyNew: 0,
  // dailyReview: 0,
  // weekly: 0,
  // monthly: 0,
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
      .addCase(SIGN_IN.fulfilled, (state, { payload }) => {
        // require mfa code
        if (payload.mfaRequired) {
          state.loginStatus = Consts.SIGN_STATUS.MFA_REQUIRED;
        } else if (payload.newPasswordRequired) {
          // require new password
          state.loginStatus = Consts.SIGN_STATUS.NEW_PASSWORD_REQUIRED;
        } else {
          state.loginStatus = Consts.SIGN_STATUS.LOGINED;
        }

        state.username = payload.username;

        if (payload.idToken && payload.accessToken && payload.refreshToken) {
          state.tokens = {
            idToken: payload.idToken,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
          };
        }
      })
      .addCase(SIGN_UP.fulfilled, (state, { payload }) => {
        console.log('SIGN UP Success');
      });
  },
});

export default slice;
