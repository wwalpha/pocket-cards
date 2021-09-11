import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { APIs, Actions, App } from 'typings';

export const success = createAction<Actions.WordDetailPayload, App.WordDetail>(
  ActionTypes.WORDS_SUCCESS_DETAILS,
  (detail) => ({
    datas: detail,
  })
);

/** 単語詳細 */
const detail: Actions.WordDetailAction = (word: string) => async (dispatch, _, api) => {
  dispatch(startLoading());

  try {
    // 単語詳細画面へ遷移する
    const prefix = Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyEdit].split(':')[0];

    dispatch(push(`${prefix}${word}`));

    // 単語詳細情報を取得する
    const res = await api.get<APIs.E001Response>(Consts.E001_URL(word));

    dispatch(
      success({
        id: res.item?.id as string,
        mp3: res.item?.mp3,
        pronounce: res.item?.pronounce,
        vocChn: res.item?.vocChn,
        vocJpn: res.item?.vocJpn,
      })
    );
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};

export default detail;
