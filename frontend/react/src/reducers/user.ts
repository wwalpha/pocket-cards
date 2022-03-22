import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, Payloads, User } from 'typings';

const userState: Domains.UserState = {
  details: undefined,
  remainingTest: 0,
  remainingReview: 0,
  daily: 0,
  dailyNew: 0,
  dailyReview: 0,
  weekly: 0,
  monthly: 0,
};

const slice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    // Sign in
    USER_SIGN_IN: (state, { payload }: PayloadAction<User.Details>) => {
      state.details = payload;
    },

    // Sign out
    USER_SIGN_OUT: (state) => {
      state.details = undefined;
    },

    // USER_HISTORY: (state, { payload }: PayloadAction<Payloads.History>) => {
    //   state.remainingReview = payload.remaining.review;
    //   state.remainingTest = payload.remaining.test;
    //   state.daily = payload.daily.total;
    //   state.dailyNew = payload.daily.new;
    //   state.dailyReview = payload.daily.review;
    //   state.weekly = payload.weekly;
    //   state.monthly = payload.monthly;
    // },
  },
});

export default slice;
