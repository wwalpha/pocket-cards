import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Payloads, APIs } from 'typings';

export const STUDY_START = createAsyncThunk<Payloads.StudyCase, string>(
  'study/STUDY_START',
  async (mode, { getState }) => {
    const { activeGroup } = (getState() as RootState).group;

    // default study case: new
    let url = Consts.C006_URL(activeGroup);

    // study case: test
    if (mode === Consts.MODES.AllTest) {
      url = Consts.C007_URL(activeGroup);
    }
    // study case: review
    if (mode === Consts.MODES.Review) {
      url = Consts.C008_URL(activeGroup);
    }

    const res = await API.get<APIs.C006Response>(url);

    return {
      mode: mode,
      items: res.words,
    };
  }
);
