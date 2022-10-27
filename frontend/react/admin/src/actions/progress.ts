import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const search = (student: string, subject: string, curriculum: string) => async (dispatch: AppDispatch) => {
  // 検索する
  dispatch(
    Actions.PROGRESS_SEARCH({
      student: student,
      subject: subject,
      curriculum: curriculum,
    })
  );
};
