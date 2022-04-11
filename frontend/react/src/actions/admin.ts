import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Paths } from '@constants';
import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const selectGroup = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.GROUP_ACTIVE(id));
};

/** switch menu */
export const switchSubject = (id: string, pathname: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_SUBJECT(id));
  // move to top page
  if (pathname !== Paths.PATHS_ADMIN_DASHBOARD) {
    dispatch(push(Paths.PATHS_ADMIN_DASHBOARD));
  }
};

export const curriculumRegist = (groupId: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(
        Actions.USER_CURRICULUM_REGIST({
          userId: 'Google_109439805128280065775',
          groupId: groupId,
        })
      );
    })
  );

export const curriculumRemove = (id: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(Actions.USER_CURRICULUM_REMOVE(id));
    })
  );

/** 質問リスト */
export const questionList = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST()).unwrap();

      dispatch(push(Paths.PATHS_ADMIN_QUESTIONS));
    })
  );

/** 質問リスト */
export const getStudentList = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      dispatch(Actions.USER_STUDENTS_LIST());

      dispatch(push(Paths.PATHS_ADMIN_STUDENTS));
    })
  );

export const studentRegist = (username: string, password: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.USER_STUDENT_REGIST({ username, password })).unwrap();

      dispatch(Actions.APP_SHOW_USER_REGIST(false));

      getStudentList()(dispatch);
    })
  );

/** 質問リスト */
export const uploadQuestions = (texts: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // regist questions
      await dispatch(Actions.GROUP_QUESTION_REGIST(texts)).unwrap();

      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST()).unwrap();
    })
  );
