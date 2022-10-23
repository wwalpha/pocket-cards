import { Actions } from '@reducers';
import { Consts } from '@constants';
import { AppDispatch } from 'typings';

export const dailyTest = (student: string, subject: string) => async (dispatch: AppDispatch) => {
  // websocket connect
  dispatch(Actions.APP_CONNECT());
  // save search condition
  dispatch(
    Actions.STUDY_CONDITIONS({
      student: student,
      subject: subject,
    })
  );
  // get questions
  await dispatch(
    Actions.STUDY_QUESTIONS({
      userId: student,
      subject: subject,
    })
  ).unwrap();
};

export const correct = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_SHOW_QUESTION(Consts.Commands.SHOW_CORRECT));
};

export const failure = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_SHOW_ANSWER());
};

export const goNext = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_SHOW_QUESTION(Consts.Commands.SHOW_NEXT));
};
