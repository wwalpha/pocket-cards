import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { Tables, APIs } from 'typings';

export const STUDY_QUESTIONS = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS',
  async ({ subject, userId }) => {
    const res = await API.post<APIs.QuestionOrderResponse, APIs.QuestionOrderRequest>(
      URLs.CURRICULUM_ORDER_QUESTIONS(),
      {
        subject: subject,
        userId: userId,
      }
    );

    return res.questions;
  }
);
