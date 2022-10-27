import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as ProgressActions from './progressActions';

const progressState: Domains.ProgressState = {
  isSearching: false,
  searchConditions: {},
  searchResults: [],
};

const slice = createSlice({
  name: 'progress',
  initialState: progressState,
  reducers: {
    // save search conditions
    PROGRESS_SAVE_CONDITIONS: (state, { payload }: PayloadAction<{ student: string; subject: string }>) => {
      state.searchConditions.student = payload.student;
      state.searchConditions.subject = payload.subject;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ProgressActions.PROGRESS_SEARCH.fulfilled, (state, { payload }) => {
        // 検索開始
        state.isSearching = true;
      })
      .addCase(ProgressActions.PROGRESS_GET_STATUS.fulfilled, (state, { payload }) => {
        state.isSearching = false;
        state.searchResults = payload;
      });
  },
});

export default slice;
