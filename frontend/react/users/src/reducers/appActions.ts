import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { API } from '@utils';
import { APIs } from 'typings';

export const APP_INQUIRY = createAsyncThunk<void, string>('app/APP_INQUIRY', async (qid) => {
  await API.post<APIs.InquiryRegistResponse, APIs.InquiryRegistResquest>(URLs.INQUIRY(), {
    id: qid,
  });
});
