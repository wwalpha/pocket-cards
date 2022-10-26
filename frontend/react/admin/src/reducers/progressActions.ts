import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs, Tables } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<string[], { subject: string; userId: string }>(
  'progress/PROGRESS_SEARCH',
  async ({ subject, userId }) => {
    const res = await API.post<APIs.DailyTestQuestionsResponse, APIs.DailyTestQuestionsRequest>(
      URLs.REPORTS_DAILY_TEST(),
      {
        subject: subject,
        uid: userId,
      }
    );

    return res.qid;
  }
);

// 進捗検索
export const PROGRESS_GET_QUESTION = createAsyncThunk<Tables.TQuestions, string>(
  'progress/PROGRESS_SEARCH',
  async (qid) => {
    const res = await API.get<APIs.LearningProgressResponse>(URLs.REPORTS_DAILY_TEST(), {});

    return {};
  }
);
