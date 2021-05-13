import { createAction } from 'redux-actions';
import isEmpty from 'lodash/isEmpty';
import { push } from 'connected-react-router';
import { defaultFailure, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { API, Actions } from 'typings';

const success = createAction(ActionTypes.A0_01_SUCCESS, (data: API.D001Response) => ({ data }));

/** 画像アップロード */
export const uploadImage: Actions.UploadImageAction = (image: string) => async (dispatch, _, api) => {
  // 画像アップロード開始イベント
  dispatch(startLoading());

  // データチェック
  if (isEmpty(image) || image.split(';').length <= 1) {
    dispatch(defaultFailure(null as unknown as Error));
    return;
  }

  const imageSrc = image.replace(/^.*,/, '');

  try {
    const res = await api.post<API.D001Response>(Consts.D001_URL(), {
      language: 'en',
      content: imageSrc,
    } as API.D001Request);
    Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList];

    // データ保存
    dispatch(success(res));
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList]));
  } catch (err) {
    dispatch(defaultFailure(err));
  }
};
