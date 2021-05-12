import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, defaultRequest } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { API, APP } from 'typings';

export const success = createAction<APP.E006Payload, API.E001Response>(ActionTypes.E0_06_SUCCESS, (res) => ({
  res,
}));

/** 単語詳細 */
const detail: APP.WordDetailAction = (word: string) => async (dispatch, _, api) => {
  dispatch(defaultRequest());

  try {
    // 単語詳細画面へ遷移する
    const prefix = Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyEdit].split(':')[0];

    dispatch(push(`${prefix}${word}`));

    // 単語詳細情報を取得する
    api.get(Consts.E001_URL(word)).then((res) => dispatch(success(res)));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};

export default detail;
