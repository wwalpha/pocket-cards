import { immerable, produce } from 'immer';
import { Actions, App, Tables } from 'typings';

export default class Group {
  [immerable] = true;

  /** user's all group infomations */
  groups: Tables.TGroups[] = [];
  /** Group word list */
  groupWords: App.GroupWords = {};
  /** Group word list */
  regists: string[] = [];

  /** グループの新規登録 */
  addGroup(payload: Actions.GroupRegistPayload) {
    return produce(this, (draft) => {
      draft.groups.push(payload);
    });
  }

  /** グループ一覧を設定 */
  setGroupList({ items }: Actions.GroupListPayload) {
    return produce(this, (draft) => {
      draft.groups = items;
    });
  }

  /** グループの削除 */
  delGroup(payload: Actions.GroupDeletePayload) {
    return produce(this, (draft) => {
      draft.groups = this.groups.filter((item) => item.id !== payload.groupId);
    });
  }

  /** グループ単語の追加 */
  setGroupWords({ groupId, datas }: Actions.GroupWordsPayload) {
    return produce(this, (draft) => {
      draft.groupWords[groupId] = datas.items;
    });
  }

  /** 単語登録のリスト設定する */
  setRegists(payload: Actions.UploadImagePayload) {
    return produce(this, (draft) => {
      draft.regists = payload.data.words;
    });
  }

  /** 単語登録一覧をクリアする */
  clearRegists() {
    return produce(this, (draft) => {
      draft.regists = [];
    });
  }

  /** 単語登録一覧をクリアする */
  removeRegist(payload: Actions.RegistRemovePayload) {
    return produce(this, (draft) => {
      draft.regists = draft.regists.filter((item) => item !== payload.word);
    });
  }
}
