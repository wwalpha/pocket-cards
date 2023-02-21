import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts, URLs } from '@constants';
import { API } from '@utils';
import { Tables, APIs, RootState } from 'typings';

const getQuestions = async (subject: string, userId: string) => {
  const res = await API.post<APIs.DailyExamResponse, APIs.DailyExamRequest>(URLs.DAILY_EXAM(), {
    subject: subject,
    userId: userId,
  });

  return res.questions;
};

const getReview = async (subject: string, userId: string) => {
  const res = await API.post<APIs.DailyReviewResponse, APIs.DailyReviewRequest>(URLs.DAILY_REVIEW(), {
    subject: subject,
    userId: userId,
  });

  return res.questions;
};

export const STUDY_QUESTIONS = createAsyncThunk<
  Tables.TQuestions[],
  { subject: string; userId: string; review: boolean }
>('study/STUDY_QUESTIONS', async ({ subject, userId, review }) => {
  // 復習問題
  if (review === true) {
    return await getReview(subject, userId);
  }

  // テスト問題
  return await getQuestions(subject, userId);
});

export const STUDY_QUESTIONS_CONTINUE = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS_CONTINUE',
  async ({ subject, userId }) => {
    return await getQuestions(subject, userId);
  }
);

export const STUDY_SHOW_QUESTION = createAsyncThunk<string | undefined, string>(
  'study/STUDY_SHOW_QUESTION',
  async (command, { getState, dispatch }) => {
    const { questions, index, searchConditions } = (getState() as RootState).study;
    const nextIndex = index + 1 === questions.length ? 0 : index + 1;
    const question = questions[nextIndex];

    // データ不足の場合、再検索を行う
    if (questions.length <= 3 && searchConditions.review === false) {
      dispatch(
        STUDY_QUESTIONS_CONTINUE({
          subject: searchConditions.subject || '',
          userId: searchConditions.student || '',
        })
      );
    }

    return command === Consts.Commands.SHOW_NEXT ? undefined : question.id;
  }
);
