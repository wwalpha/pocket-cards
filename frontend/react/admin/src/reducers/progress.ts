import { createSlice } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as ProgressActions from './progressActions';

const progressState: Domains.ProgressState = {
  searchConditions: {},
  searchResults: [],
};

const slice = createSlice({
  name: 'progress',
  initialState: progressState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(ProgressActions.PROGRESS_SEARCH.fulfilled, (state, { payload }) => {
      state.searchResults = payload;
    });
    builder.addCase(ProgressActions.CURRICULUM_OVERALL.fulfilled, (state, { payload }) => {
      state.searchResults = payload;
    });
  },
});

export default slice;
