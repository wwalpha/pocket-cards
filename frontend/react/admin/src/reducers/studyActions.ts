import { createAsyncThunk } from '@reduxjs/toolkit';
import WebSocket from 'isomorphic-ws';
import { Consts, URLs } from '@constants';
import { API } from '@utils';
import { Tables, APIs, RootState } from 'typings';

let ws: WebSocket;

const getQuestions = async (subject: string, userId: string) => {
  const res = await API.post<APIs.QuestionTestResponse, APIs.QuestionTestRequest>(URLs.DAILY_TEST(), {
    subject: subject,
    userId: userId,
  });

  return res.questions;
};

export const STUDY_QUESTIONS = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS',
  async ({ subject, userId }) => {
    const questions = await getQuestions(subject, userId);

    // 未初期化の場合
    if (!ws) {
      const url = await URLs.WSS_URL();
      ws = new WebSocket(url);
      ws.onmessage = onmessage;
    }

    return questions;
  }
);

export const STUDY_QUESTIONS_CONTINUE = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS_CONTINUE',
  async ({ subject, userId }) => {
    return await getQuestions(subject, userId);
  }
);

export const STUDY_SHOW_QUESTION = createAsyncThunk<void, string>(
  'study/STUDY_SHOW_QUESTION',
  async (command, { getState, dispatch }) => {
    const { questions, index, student, subject } = (getState() as RootState).study;
    const nextIndex = index + 1 === questions.length ? 0 : index + 1;
    const question = questions[nextIndex];

    // send message to client
    sendQuestion(command, question);

    // データ不足の場合、再検索を行う
    if (questions.length <= 3) {
      dispatch(
        STUDY_QUESTIONS_CONTINUE({
          subject,
          userId: student,
        })
      );
    }
  }
);

export const STUDY_SHOW_ANSWER = createAsyncThunk<void, string>('study/STUDY_SHOW_ANSWER', async (command) => {
  ws.send(
    JSON.stringify({
      command: command,
    })
  );
});

const onmessage = (event: WebSocket.MessageEvent) => {
  console.log(event);
};

const sendQuestion = (command: string, q: Tables.TQuestions) => {
  console.log(q.groupId, q.id);

  ws.send(
    JSON.stringify({
      command: command,
      payload: JSON.stringify({
        gid: q.groupId,
        qid: q.id,
      }),
    })
  );
};
