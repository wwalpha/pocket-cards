import { Actions } from '@reducers';
import { AppDispatch } from 'typings';

export const search = (curriculums: string[], period?: string) => async (dispatch: AppDispatch) => {
  // 検索する
  dispatch(
    Actions.PROGRESS_SEARCH({
      curriculums: curriculums,
      period: period,
    })
  );
};
