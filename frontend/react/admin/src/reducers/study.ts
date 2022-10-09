import { Consts } from '@constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains } from 'typings';
import * as StudyActions from './studyActions';

const studyState: Domains.StudyState = {
  isOnline: false,
  answered: [],
  questions: [],
  index: -1,
  student: '',
  subject: '',
};

const slice = createSlice({
  name: 'user',
  initialState: studyState,
  reducers: {
    // save search conditions
    STUDY_CONDITIONS: (state, { payload }: PayloadAction<{ student: string; subject: string }>) => {
      state.student = payload.student;
      state.subject = payload.subject;
    },
    STUDY_ONLINE: (state, { payload }: PayloadAction<string>) => {
      if (payload === state.student) {
        state.isOnline = true;
      }
    },
    STUDY_OFFLINE: (state, { payload }: PayloadAction<string>) => {
      if (payload === state.student) {
        state.isOnline = false;
      }
    },
    STUDY_SHOW_ANSWER: (state, { payload }: PayloadAction<string>) => {
      const question = state.questions[state.index];
      // answerd question id
      state.answered.push(question.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(StudyActions.STUDY_QUESTIONS.fulfilled, (state, { payload }) => {
        state.questions = payload;
        state.index = 0;
      })
      .addCase(StudyActions.STUDY_SHOW_QUESTION.fulfilled, (state, { payload }) => {
        // answerd question
        if (payload) {
          state.answered.push(payload);
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
