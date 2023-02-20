import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<
  APIs.CurriculumStatusResponseItem[],
  { curriculums: string[]; startDate: string; endDate: string }
>('progress/PROGRESS_SEARCH', async ({ curriculums, startDate, endDate }) => {
  const res = await API.post<APIs.CurriculumStatusResponse, APIs.CurriculumStatusRequest>(URLs.CURRICULUM_PROGRESS(), {
    curriculums: curriculums,
    startDate: startDate,
    endDate: endDate,
  });

  return res.items;
});
