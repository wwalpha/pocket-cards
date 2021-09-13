import { withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { push } from 'connected-react-router';
import { APIs, AppDispatch } from 'typings';

/** 単語削除 */
export const del = (groupId: string, word: string) => (dispatch: AppDispatch) =>
  withLoading(async () => {
    // 画面遷移
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]));

    await API.del<APIs.C005Response>(Consts.C005_URL(groupId, word));

    // データ保存
    dispatch(
      Actions.GROUP_WORD_REMOVE({
        id: groupId,
        word,
      })
    );
  });

/** 単語削除 */
export const deleteRow = (groupId: string, word: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // データ保存
      dispatch(Actions.GROUP_DELETE());
    })
  );

/** 単語詳細 */
export const detail = (word: string) => (dispatch: AppDispatch) =>
  withLoading(async () => {
    // 単語詳細画面へ遷移する
    const prefix = Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyEdit].split(':')[0];

    dispatch(push(`${prefix}${word}`));

    // 単語詳細情報を取得する
    const res = await API.get<APIs.E001Response>(Consts.E001_URL(word));

    // TODO
    // Hooks.dispatch()(
    //   GroupActions.({
    //     id: res.item?.id as string,
    //     mp3: res.item?.mp3,
    //     pronounce: res.item?.pronounce,
    //     vocChn: res.item?.vocChn,
    //     vocJpn: res.item?.vocJpn,
    //   })
    // );
  });

/** Get words list in group */
export const list = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // データ保存
      dispatch(Actions.GROUP_LIST());
    })
  );
