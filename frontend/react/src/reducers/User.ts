import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, User } from 'typings';

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

    USER_HISTORY: (state) => {
      // draft.remainingReview = info.remaining.review;
      // draft.remainingTest = info.remaining.test;
      // draft.daily = info.daily.total;
      // draft.dailyNew = info.daily.new;
      // draft.dailyReview = info.daily.review;
      // draft.weekly = info.weekly;
      // draft.monthly = info.monthly;
    },
  },
});

export default slice;
