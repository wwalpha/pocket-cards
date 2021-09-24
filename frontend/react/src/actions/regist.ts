import { push } from 'connected-react-router';
import { isEmpty } from 'lodash';
import { defaultFailure, withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { APIs, AppDispatch, RootState } from 'typings';

/** 単語クリア */
export const clear = () => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_REGIST_CLEAR());
};

/** 単語登録 */
export const registWords = (words: string[]) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async (state: RootState) => {
      const { activeGroup } = state.group;

      for (; words.length > 0; ) {
        const unit = words.length > 100 ? 100 : words.length;
        const items = words.splice(0, unit);

        await API.post(Consts.C001_URL(activeGroup), {
          words: items,
        } as APIs.C001Request);
      }

      // データ保存
      dispatch(Actions.GROUP_REGIST_CLEAR());
      // 画面遷移
      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistFinish]));
    })
  );

/** 指定単語削除 */
export const removeWord = (word: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_REGIST_REMOVE(word));
};

/** ファイルアップロード */
export const uploadFile = (text: string) => (dispatch: AppDispatch) => {
  // データチェック
  if (isEmpty(text) || text.split(';').length <= 1) {
    return;
  }

  const base64 = text.replace(/^.*,/, '');
  const allLines = atob(base64).toString().split('\n');

  // store data
  dispatch(Actions.GROUP_REGIST_SAVE(allLines));
  // 画面遷移
  dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList]));
};

/** 画像アップロード */
export const uploadImage = (image: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // データチェック
      if (isEmpty(image) || image.split(';').length <= 1) {
        dispatch(defaultFailure(null as unknown as Error));
        return;
      }

      const imageSrc = image.replace(/^.*,/, '');

      const res = await API.post<APIs.D001Request, APIs.D001Response>(Consts.D001_URL(), {
        language: 'en',
        content: imageSrc,
      });

      // データ保存
      dispatch(Actions.GROUP_REGIST_SAVE(res.words));
      // 画面遷移
      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RegistList]));
    })
  );

export const manual = (word?: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async (state: RootState) => {
      const { activeGroup } = state.group;

      if (!word) return;

      await API.post(Consts.C001_URL(activeGroup), {
        words: [word],
      } as APIs.C001Request);

      // 画面遷移
      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]));
      // get latest list
      dispatch(Actions.GROUP_WORD_LIST(activeGroup));
    })
  );
