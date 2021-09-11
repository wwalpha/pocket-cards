import { handleActions, Action } from 'redux-actions';
import { Group } from '@domains';
import { ActionTypes } from '@constants';
import { Actions } from 'typings';

const reducer = handleActions<Group, any>(
  {
    /** グループ新規追加 */
    [ActionTypes.GROUP_SUCCESS_REGIST]: (store: Group, { payload }: Action<Actions.GroupRegistPayload>) =>
      store.addGroup(payload),

    /** グループ一覧 */
    [ActionTypes.GROUP_SUCCESS_LIST]: (store: Group, { payload }: Action<Actions.GroupListPayload>) =>
      store.setGroupList(payload),

    /** グループ削除 */
    [ActionTypes.GROUP_SUCCESS_DELETE]: (store: Group, { payload }: Action<Actions.GroupDeletePayload>) =>
      store.delGroup(payload),

    /** グループ単語 */
    [ActionTypes.GROUP_SUCCESS_WORDS]: (store: Group, { payload }: Action<Actions.GroupWordsPayload>) =>
      store.setGroupWords(payload),

    /** グループ単語の削除 */
    [ActionTypes.GROUP_SUCCESS_REMOVE_WORD]: (store: Group, { payload }: Action<Actions.WordDeletePayload>) =>
      store.removeWordInGroup(payload.groupId, payload.word),

    /** 画像アップロード */
    [ActionTypes.REGIST_SUCCESS_IMAGE2TEXT]: (store: Group, { payload }: Action<Actions.ImageUploadPayload>) =>
      store.setRegists(payload.data.words),

    /** 画像アップロード */
    [ActionTypes.REGIST_SUCCESS_FILEUPLOAD]: (store: Group, { payload }: Action<Actions.FileUploadPayload>) =>
      store.setRegists(payload.words),

    /** 単語登録正常終了 */
    [ActionTypes.REGIST_SUCCESS_REGIST]: (store: Group) => store.clearRegists(),

    /** 単語登録一覧をクリア */
    [ActionTypes.REGIST_SUCCESS_CLEAR]: (store: Group) => store.clearRegists(),

    /** 単語登録一覧をクリア */
    [ActionTypes.REGIST_SUCCESS_REMOVE]: (store: Group, { payload }: Action<Actions.RegistRemovePayload>) =>
      store.removeRegist(payload),
  },
  new Group()
);

export default reducer;
