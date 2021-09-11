import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { APIs, Actions } from 'typings';

export const success = createAction<Actions.E006Payload, APIs.E001Response>(ActionTypes.E0_06_SUCCESS, (res) => ({
  res,
}));

/** 単語詳細 */
const detail: Actions.WordDetailAction = (word: string) => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    // 単語詳細画面へ遷移する
    const prefix = Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyEdit].split(':')[0];

    dispatch(push(`${prefix}${word}`));

    // 単語詳細情報を取得する
    const res = await api.get<APIs.E001Response>(Consts.E001_URL(word));

    dispatch(success(res));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default detail;
