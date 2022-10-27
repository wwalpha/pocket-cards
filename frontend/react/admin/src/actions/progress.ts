import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const search = (student: string, subject: string) => async (dispatch: AppDispatch) => {
  // 検索条件を保存する
  dispatch(
    Actions.PROGRESS_SAVE_CONDITIONS({
      student: student,
      subject: subject,
    })
  );

  // 検索する
  dispatch(
    Actions.PROGRESS_SEARCH({
      student: student,
      subject: subject,
    })
  );
};
