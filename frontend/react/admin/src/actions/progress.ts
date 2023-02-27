import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const search =
  (curriculums: string[], startDate: string, endDate: string, unlearned?: string) => async (dispatch: AppDispatch) => {
    // 検索する
    dispatch(
      Actions.PROGRESS_SEARCH({
        curriculums: curriculums,
        startDate: startDate,
        endDate: endDate,
        unlearned: unlearned,
      })
    );
  };
