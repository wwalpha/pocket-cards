import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const curriculumOrder = (student: string, subject: string) => async (dispatch: AppDispatch) => {
  dispatch(
    Actions.STUDY_CONDITIONS({
      student: student,
      subject: subject,
    })
  );

  await dispatch(
    Actions.STUDY_QUESTIONS({
      userId: student,
      subject: subject,
    })
  ).unwrap();
};

export const correct = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_SHOW_QUESTION());
};

export const failure = () => async (dispatch: AppDispatch) => {
  dispatch(Actions.STUDY_SHOW_ANSWER());
};
