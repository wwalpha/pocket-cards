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
      dispatch(STUDY_EXAM());
    }
  }
);

export const STUDY_IGNORE = createAsyncThunk<string, WordItem>('study/STUDY_IGNORE', async (item) => {
  // ignore word from study words
  await API.post<APIs.QuestionIgnoreResponse, APIs.QuestionIgnoreRequest>(URLs.STUDY_IGNORE(item.groupId), {
    qid: item.id,
  });

  return item.question;
});

// 学習
export const STUDY_PRACTICE = createAsyncThunk<WordItem[], void>('study/STUDY_PRACTICE', async () => {
  const res = await API.get<APIs.DailyPracticeResponse>(URLs.DAILY_PRACTICE());

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
export const STUDY_EXAM = createAsyncThunk<WordItem[], void>('study/STUDY_EXAM', async () => {
  const res = await API.get<APIs.DailyExamResponse>(URLs.DAILY_EXAM());

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
    const { current, mode } = (getState() as RootState).study;

    if (!current) return correct;

    // request parameter
    const param = correct === true ? '1' : '0';

    // 学習モード、且つ不正解の場合、サーバ通信しない
    if (mode === Consts.MODES.Practice && correct !== true) {
      return correct;
    }

    // update question answer
    await API.post<APIs.QuestionAnswerResponse, APIs.QuestionAnswerRequest>(URLs.DAILY_ANSWER(), {
      qid: current.id,
      correct: param,
    });

    return correct;
  }
);
