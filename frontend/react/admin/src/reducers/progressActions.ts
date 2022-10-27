import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs } from 'typings';

// 進捗検索
export const PROGRESS_SEARCH = createAsyncThunk<APIs.CurriculumStatusResponseItem[], { curriculum: string }>(
  'progress/PROGRESS_SEARCH',
  async ({ curriculum }) => {
    const res = await API.get<APIs.CurriculumStatusResponse>(URLs.CURRICULUM_PROGRESS(curriculum));

    return res.items;
  }
);
