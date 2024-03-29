import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as StudyActions from './studyActions';

const studyState: Domains.StudyState = {
  isOnline: false,
  correctCount: 0,
  incorrectCount: 0,
  answered: [],
  questions: [],
  index: -1,
  searchConditions: {},
};

const slice = createSlice({
  name: 'study',
  initialState: studyState,
  reducers: {
    // save search conditions
    STUDY_CONDITIONS: (state, { payload }: PayloadAction<{ student: string; subject: string; review: boolean }>) => {
      state.searchConditions.student = payload.student;
      state.searchConditions.subject = payload.subject;
      state.searchConditions.review = payload.review;
    },
    STUDY_ONLINE: (state, { payload }: PayloadAction<string>) => {
      if (payload === state.searchConditions.student) {
        state.isOnline = true;
      }
    },
    STUDY_OFFLINE: (state, { payload }: PayloadAction<string>) => {
      if (payload === state.searchConditions.student) {
        state.isOnline = false;
      }
    },
    STUDY_SHOW_ANSWER: (state, { payload }: PayloadAction<string>) => {
      const question = state.questions[state.index];
      // answerd question id
      state.answered.push(question.id);
      // count incorrect
      state.incorrectCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(StudyActions.STUDY_QUESTIONS.fulfilled, (state, { payload }) => {
        // initialize
        state.questions = payload;
        state.answered = [];
        state.correctCount = 0;
        state.incorrectCount = 0;
        state.index = 0;
      })
      .addCase(StudyActions.STUDY_SHOW_QUESTION.fulfilled, (state, { payload }) => {
        // answerd question
        if (payload) {
          state.answered.push(payload);
          // count correct
          state.correctCount += 1;
        }
        // remove question
        state.questions = state.questions.filter((item) => item.id !== state.questions[state.index].id);
        // recalculate index
        if (state.index + 1 >= state.questions.length) {
          state.index = 0;
        }
      })
      .addCase(StudyActions.STUDY_QUESTIONS_CONTINUE.fulfilled, (state, { payload }) => {
        payload.forEach((q) => {
          // answered question
          if (state.answered.includes(q.id)) return;
          // find the same question
          const r = state.questions.find((item) => item.id === q.id);
          // if not found, add question to queue
          if (!r) state.questions.push(q);
        });
      });
  },
});

export default slice;
