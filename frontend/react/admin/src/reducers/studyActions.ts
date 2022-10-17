import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts, URLs } from '@constants';
import { API } from '@utils';
import { Tables, APIs, RootState } from 'typings';

const getQuestions = async (subject: string, userId: string) => {
  const res = await API.get<APIs.QuestionTestResponse>(URLs.DAILY_TEST(subject, userId));

  return res.questions;
};

export const STUDY_QUESTIONS = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS',
  async ({ subject, userId }) => {
    const questions = await getQuestions(subject, userId);

    return questions;
  }
);

export const STUDY_QUESTIONS_CONTINUE = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS_CONTINUE',
  async ({ subject, userId }) => {
    return await getQuestions(subject, userId);
  }
);

export const STUDY_SHOW_QUESTION = createAsyncThunk<string | undefined, string>(
  'study/STUDY_SHOW_QUESTION',
  async (command, { getState, dispatch }) => {
    const { questions, index, student, subject } = (getState() as RootState).study;
    const nextIndex = index + 1 === questions.length ? 0 : index + 1;
    const question = questions[nextIndex];

    // データ不足の場合、再検索を行う
    if (questions.length <= 3) {
      dispatch(
        STUDY_QUESTIONS_CONTINUE({
          subject,
          userId: student,
        })
      );
    }

    return command === Consts.Commands.SHOW_NEXT ? undefined : question.id;
  }
);
