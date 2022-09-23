import { Middleware } from 'redux';
import WebSocket from 'isomorphic-ws';
import { Actions } from '@reducers';
import { Consts, URLs } from '@constants';
import { RootState } from '@store';
import { Tables } from 'typings';

const socket: Middleware = (store) => {
  let ws: WebSocket;

  const onopen = (event: WebSocket.Event) => {
    console.log('Socket Connected...');
    store.dispatch(Actions.STUDY_CONNECTED());
  };

  const onclose = (event: WebSocket.CloseEvent) => {
    console.log('Socket Disconnected....');
    store.dispatch(Actions.STUDY_DISCONNECT());
  };

  const onmessage = (event: WebSocket.MessageEvent) => {
    const state = store.getState() as RootState;

    console.log(event);

    try {
      const value = JSON.parse(event.data.toString());

      // user online
      if (value['ON_LINE']) {
        store.dispatch(Actions.STUDY_ONLINE(value['ON_LINE']));

        const { questions, index } = state.study;
        // show current question
        sendQuestion(Consts.Commands.SHOW_NEXT, questions[index]);
      }

      // user offline
      if (value['OFF_LINE']) {
        store.dispatch(Actions.STUDY_OFFLINE(value['OFF_LINE']));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendQuestion = (command: string, question: Tables.TQuestions) => {
    console.log(command, question.groupId, question.id);

    ws.send(
      JSON.stringify({
        command: command,
        payload: JSON.stringify({
          gid: question.groupId,
          qid: question.id,
        }),
      })
    );
  };

  return (next) => async (action) => {
    const state = store.getState() as RootState;
    console.log(action);

    if (Actions.STUDY_CONNECT.type.match(action.type)) {
      const url = await URLs.WEBSOCKET_URL();
      ws = new WebSocket(url);
      ws.onopen = onopen;
      ws.onclose = onclose;
      ws.onmessage = onmessage;

      console.log('Socket start connect....');
    }

    // show answer
    if (Actions.STUDY_SHOW_ANSWER.type.match(action.type)) {
      const command = action.payload;

      ws.send(
        JSON.stringify({
          command: command,
        })
      );
    }

    // show question
    if (Actions.STUDY_SHOW_QUESTION.fulfilled.type.match(action.type)) {
      const command = action.meta.arg;
      const { questions, index } = state.study;
      const nextIndex = index + 1 === questions.length ? 0 : index + 1;
      const question = questions[nextIndex];

      sendQuestion(command, question);
    }

    next(action);
  };
};

export default socket;
