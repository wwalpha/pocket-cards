import { handleActions, Action } from 'redux-actions';
import { Group } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<Group, any>(
  {
    /** グループ一覧 */
    [ActionTypes.E0_01_SUCCESS]: (store: Group, { payload }: Action<Actions.E001Payload>) =>
      store.addGroupList(payload),

    /** グループ新規追加 */
    [ActionTypes.E0_02_SUCCESS]: (store: Group, { payload }: Action<Actions.E002Payload>) => store.addGroup(payload),

    /** グループ編集 */
    // [ActionTypes.E0_03_SUCCESS]: (store: Group) => store.endLoading(),

    /** グループ削除 */
    [ActionTypes.E0_04_SUCCESS]: (store: Group, { payload }: Action<Actions.E004Payload>) => store.delGroup(payload),

    /** 単語リスト追加 */
    [ActionTypes.E0_05_SUCCESS]: (store: Group, { payload }: Action<Actions.E005Payload>) => store.addWordList(payload),

    /** 単語詳細取得 */
    [ActionTypes.E0_06_REQUEST]: (store: Group) => store.clearWordDetail(),
    [ActionTypes.E0_06_SUCCESS]: (store: Group, { payload }: Action<Actions.E006Payload>) =>
      store.setWordDetail(payload),

    /** 単語削除 */
    [ActionTypes.E0_08_SUCCESS]: (store: Group, { payload }: Action<Actions.E008Payload>) => store.delWord(payload),
  },
  new Group()
);

export default reducer;
