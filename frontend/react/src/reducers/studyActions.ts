import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Payloads, APIs } from 'typings';

const getWords = async (mode: string, group?: string): Promise<Payloads.StudyCase> => {
  let url: string | undefined;

  switch (mode) {
    case Consts.MODES.New:
      // new
      url = group ? Consts.C006_URL(group) : Consts.D005_URL();
      break;
    case Consts.MODES.Review:
      // review
      url = group ? Consts.C008_URL(group) : Consts.D006_URL();
      break;
    case Consts.MODES.AllTest:
      // test
      url = group ? Consts.C007_URL(group) : Consts.D004_URL();
      break;
    default:
      url = '';
      break;
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

export const STUDY_CONTINUE = createAsyncThunk<Payloads.StudyCase, void>(
  'study/STUDY_CONTINUE',
  async (_, { getState }) => {
    const { activeGroup } = (getState() as RootState).group;
    const { mode } = (getState() as RootState).study;

    return await getWords(mode, activeGroup);
  }
);

export const STUDY_IGNORE = createAsyncThunk<string, string>('study/STUDY_IGNORE', async (word) => {
  // ignore word from study words
  await API.post<APIs.D003Request, APIs.D003Response>(Consts.D005_URL(), {
    word,
  });

  return word;
});

export const STUDY_TODOS = createAsyncThunk<Payloads.StudyCase, string>('study/STUDY_TODOS', async (mode) => {
  return await getWords(mode);
});
