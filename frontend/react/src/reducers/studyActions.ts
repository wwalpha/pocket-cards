import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Payloads, APIs } from 'typings';

const getWords = async (mode: string, group: string): Promise<Payloads.StudyCase> => {
  // default study case: new
  let url = Consts.C006_URL(group);

  // study case: test
  if (mode === Consts.MODES.AllTest) {
    url = Consts.C007_URL(group);
  }

  // study case: review
  if (mode === Consts.MODES.Review) {
    url = Consts.C008_URL(group);
  }

  const res = await API.get<APIs.C006Response>(url);

  return {
    mode: mode,
    items: res.words,
  };
};

export const STUDY_START = createAsyncThunk<Payloads.StudyCase, string>(
  'study/STUDY_START',
  async (mode, { getState }) => {
    const { activeGroup } = (getState() as RootState).group;

    return await getWords(mode, activeGroup);
  }
);

export const STUDY_CONTINUE = createAsyncThunk<Payloads.StudyCase, string>(
  'study/STUDY_CONTINUE',
  async (mode, { getState }) => {
    const { activeGroup } = (getState() as RootState).group;

    return await getWords(mode, activeGroup);
  }
);

export const STUDY_IGNORE = createAsyncThunk<void, string>('study/STUDY_IGNORE', async (word) => {
  // ignore word from study words
  await API.post<APIs.D003Request, APIs.D003Response>(Consts.D003_URL(), {
    word,
  });
});
