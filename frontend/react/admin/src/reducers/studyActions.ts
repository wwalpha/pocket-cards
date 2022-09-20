import { createAsyncThunk } from '@reduxjs/toolkit';
import WebSocket from 'isomorphic-ws';
import { URLs } from '@constants';
import { API } from '@utils';
import { Tables, APIs, RootState } from 'typings';

let ws: WebSocket;

export const STUDY_QUESTIONS = createAsyncThunk<Tables.TQuestions[], { subject: string; userId: string }>(
  'study/STUDY_QUESTIONS',
  async ({ subject, userId }) => {
    const res = await API.post<APIs.QuestionOrderResponse, APIs.QuestionOrderRequest>(
      URLs.CURRICULUM_ORDER_QUESTIONS(),
      {
        subject: subject,
        userId: userId,
      }
    );

    const url = await URLs.WSS_URL();
    ws = new WebSocket(url);
    ws.onmessage = onmessage;

    return res.questions;
  }
);

export const STUDY_SHOW_QUESTION = createAsyncThunk<void, void>(
  'study/STUDY_SHOW_QUESTION',
  async (_, { getState }) => {
    const { questions, index } = (getState() as RootState).study;
    const nextIndex = index + 1 === questions.length ? 0 : index + 1;
    const question = questions[nextIndex];

    ws.send(
      JSON.stringify({
        command: 'SHOW_NEXT',
        payload: JSON.stringify({
          gid: question.groupId,
          qid: question.id,
        }),
      })
    );
  }
);

export const STUDY_SHOW_ANSWER = createAsyncThunk<void, void>('study/STUDY_SHOW_ANSWER', async () => {
  ws.send(
    JSON.stringify({
      command: 'SHOW_ANSWER',
    })
  );
});

const onmessage = (event: WebSocket.MessageEvent) => {
  console.log(event);
};
