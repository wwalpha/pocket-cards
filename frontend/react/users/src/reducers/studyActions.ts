import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts, URLs } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { APIs, WordItem } from 'typings';

export const STUDY_CONTINUE = createAsyncThunk<void, void>(
  'study/STUDY_CONTINUE',
  async (_, { getState, dispatch }) => {
    const { mode, rows } = (getState() as RootState).study;

    if (rows.length > Consts.STUDY_BUFFER_LOWER_LIMIT) {
      return;
    }

    // 練習モード
    if (mode === Consts.MODES.Practice) {
      dispatch(STUDY_PRACTICE());
    } else {
      // テストモード
      dispatch(STUDY_TEST());
    }
  }
);

export const STUDY_IGNORE = createAsyncThunk<string, string>('study/STUDY_IGNORE', async (word) => {
  // ignore word from study words
  await API.post<APIs.D003Response, APIs.D003Request>(Consts.D003_URL(), {
    word,
  });

  return word;
});

// 学習
export const STUDY_PRACTICE = createAsyncThunk<WordItem[], void>('study/STUDY_PRACTICE', async () => {
  const res = await API.get<APIs.QuestionStudyResponse>(URLs.DAILY_PRACTICE());

  return res.questions.map((item) => ({
    id: item.id,
    groupId: item.groupId,
    question: item.title,
    mp3: item.voiceTitle,
    pronounce: item.description,
    vocChn: item.answer.split('|')[0],
    vocJpn: item.answer.split('|')[1],
  }));
});

// テスト
export const STUDY_TEST = createAsyncThunk<WordItem[], void>('study/STUDY_TEST', async () => {
  const res = await API.get<APIs.QuestionTestResponse>(URLs.DAILY_TEST());

  return res.questions.map((item) => ({
    id: item.id,
    groupId: item.groupId,
    question: item.title,
    mp3: item.voiceTitle,
    pronounce: item.description,
    vocChn: item.answer.split('|')[0],
    vocJpn: item.answer.split('|')[1],
  }));
});

export const STUDY_ANSWER = createAsyncThunk<boolean, boolean>(
  'study/STUDY_ANSWER',
  async (correct: boolean, { getState }) => {
    // request parameter
    const { current } = (getState() as RootState).study;

    if (!current) return correct;

    // request parameter
    const param = correct === true ? '1' : '0';

    // update question answer
    await API.post<APIs.QuestionAnswerResponse, APIs.QuestionAnswerRequest>(URLs.DAILY_ANSWER(current.id), {
      correct: param,
    });

    return correct;
  }
);
