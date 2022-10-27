import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs, Tables } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<string[], { student: string; subject: string }>(
  'progress/PROGRESS_SEARCH',
  async ({ subject, student }, { dispatch }) => {
    const res = await API.post<APIs.DailyTestQuestionsResponse, APIs.DailyTestQuestionsRequest>(
      URLs.REPORTS_DAILY_TEST(),
      {
        uid: student,
        subject: subject,
      }
    );

    // 詳細取得する
    dispatch(
      PROGRESS_GET_STATUS({
        qid: res.qid,
        uid: student,
      })
    );

    return res.qid;
  }
);

// 進捗検索
export const PROGRESS_GET_STATUS = createAsyncThunk<Tables.TLearning[], { qid: string[]; uid: string }>(
  'progress/PROGRESS_GET_STATUS',
  async ({ qid, uid }) => {
    // create tasks
    const tasks = qid.map((id) => API.get<APIs.LearningDescribeResponse>(URLs.LEARNING_GET(id, uid)));

    // get question details
    const res = await Promise.all(tasks);

    return res;
  }
);
