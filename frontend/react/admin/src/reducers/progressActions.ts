import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<
  APIs.CurriculumStatusResponseItem[],
  { curriculums: string[]; startDate: string; endDate: string; unlearned?: string }
>('progress/PROGRESS_SEARCH', async ({ curriculums, startDate, endDate, unlearned }) => {
  const res = await API.post<APIs.CurriculumStatusResponse, APIs.CurriculumStatusRequest>(URLs.CURRICULUM_PROGRESS(), {
    curriculums: curriculums,
    startDate: startDate,
    endDate: endDate,
    unlearned: unlearned,
  });

  return res.items;
});

// 全体進捗
export const OVERALL_PROGRESS = createAsyncThunk<APIs.CurriculumStatusResponseItem[], { curriculums: string[] }>(
  'progress/OVERALL_PROGRESS',
  async ({ curriculums }) => {
    const res = await API.post<APIs.CurriculumStatusResponse, APIs.CurriculumStatusRequest>(
      URLs.CURRICULUM_PROGRESS(),
      {
        curriculums: curriculums,
      }
    );

    return res.items;
  }
);
