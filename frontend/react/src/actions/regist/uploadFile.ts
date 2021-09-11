import { createAction } from 'redux-actions';
import { ActionTypes, Paths } from '@constants';
import { Actions } from 'typings';
import { push } from 'connected-react-router';
import isEmpty from 'lodash/isEmpty';

const success = createAction<Actions.FileUploadPayload, string[]>(
  ActionTypes.REGIST_SUCCESS_FILEUPLOAD,
  (data: string[]) => ({
    words: data,
  })
);

/** 画像アップロード */
export const uploadFile: Actions.FileUploadAction = (text: string) => async (dispatch) => {
  // データチェック
  if (isEmpty(text) || text.split(';').length <= 1) {
    return;
  }

  const base64 = text.replace(/^.*,/, '');
  const allLines = atob(base64).toString().split('\n');

  // store data
  dispatch(success(allLines));
  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList]));
};
