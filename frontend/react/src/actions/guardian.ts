import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Paths } from '@constants';
import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const selectSubject = (id: string, pathname: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.APP_ACTIVE_SUBJECT(id));
  // move to top page
  if (pathname !== Paths.PATHS_GUARDIAN_TOP) {
    dispatch(push(Paths.PATHS_GUARDIAN_TOP));
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

      dispatch(push(Paths.PATHS_GUARDIAN_GROUP_QUESTIONS));
    })
  );
