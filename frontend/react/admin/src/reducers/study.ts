import { Consts } from '@constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as StudyActions from './studyActions';

const studyState: Domains.StudyState = {
  questions: [],
  index: -1,
  student: '',
  subject: '',
};

const slice = createSlice({
  name: 'user',
  initialState: studyState,
  reducers: {
    // Sign out
    STUDY_CONDITIONS: (state, { payload }: PayloadAction<{ student: string; subject: string }>) => {
      state.student = payload.student;
      state.subject = payload.subject;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(StudyActions.STUDY_QUESTIONS.fulfilled, (state, { payload }) => {
        state.questions = payload;
        state.index = 0;
      })
      .addCase(StudyActions.STUDY_SHOW_QUESTION.fulfilled, (state) => {
        // remove question
        state.questions = state.questions.filter((item) => item.id !== state.questions[state.index].id);
        // recalculate index
        if (state.index + 1 >= state.questions.length) {
          state.index = 0;
        }
      })
      .addCase(StudyActions.STUDY_SHOW_ANSWER.fulfilled, () => {});
  },
});

export default slice;
