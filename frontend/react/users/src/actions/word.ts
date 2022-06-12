import { Actions } from '@reducers';
import { goBack } from 'connected-react-router';
import { AppDispatch, Group } from 'typings';

export const ignore = (word: string) => async (dispatch: AppDispatch) => {
  // const { rows } = state.study;
  // // データ保存
  // await dispatch(Actions.STUDY_IGNORE(word)).unwrap();
  // // 一定数以上の場合、再取得しない
  // if (rows.length > Consts.STUDY_BUFFER_LOWER_LIMIT + 1) {
  //   return;
  // }
  // // 単語の追加
  // await dispatch(Actions.STUDY_CONTINUE()).unwrap();
};

export const ignoreWord = (details: Group.WordDetails | undefined) => (dispatch: AppDispatch) =>
  dispatch(async () => {
    // error check
    if (!details) return;

    // データ保存
    dispatch(Actions.STUDY_IGNORE(details.id)).unwrap();

    // データ保存
    dispatch(
      Actions.GROUP_WORD_REMOVE({
        id: details.groupId,
        word: details.id,
      })
    );

    dispatch(goBack());
  });
