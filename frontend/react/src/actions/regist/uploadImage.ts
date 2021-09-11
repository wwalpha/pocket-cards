import { createAction } from 'redux-actions';
import isEmpty from 'lodash/isEmpty';
import { push } from 'connected-react-router';
import { defaultFailure, endLoading, startLoading } from '@actions';
import { ActionTypes, Consts, Paths } from '@constants';
import { APIs, Actions } from 'typings';

const success = createAction<Actions.ImageUploadPayload, APIs.D001Response>(
  ActionTypes.REGIST_SUCCESS_IMAGE2TEXT,
  (data: APIs.D001Response) => ({ data })
);

/** 画像アップロード */
export const uploadImage: Actions.ImageUploadAction = (image: string) => async (dispatch, _, api) => {
  // 画像アップロード開始イベント
  dispatch(startLoading());

  // データチェック
  if (isEmpty(image) || image.split(';').length <= 1) {
    dispatch(defaultFailure(null as unknown as Error));
    return;
  }

  const imageSrc = image.replace(/^.*,/, '');

  try {
    const res = await api.post<APIs.D001Response>(Consts.D001_URL(), {
      language: 'en',
      content: imageSrc,
    } as APIs.D001Request);

    // データ保存
    dispatch(success(res));
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList]));
  } catch (err) {
    dispatch(defaultFailure(err));
  } finally {
    dispatch(endLoading());
  }
};
