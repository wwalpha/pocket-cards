import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<
  APIs.CurriculumStatusResponseItem[],
  { curriculums: string[]; period?: string }
>('progress/PROGRESS_SEARCH', async ({ curriculums, period }) => {
  const res = await API.post<APIs.CurriculumStatusResponse, APIs.CurriculumStatusRequest>(URLs.CURRICULUM_PROGRESS(), {
    curriculums: curriculums,
    endDate: period,
  });

  return res.items;
});
