import { immerable, produce } from 'immer';
import { API, Actions, APP } from 'typings';

export default class Group {
  [immerable] = true;

  rows: APP.GroupInfo[] = [];
  words: APP.GroupWordsItem[] = [];
  wordDetail?: API.E001Response = undefined;

  /**
   * グループ一覧追加
   */
  addGroupList({ groups }: Actions.E001Payload) {
    return produce(this, (draft) => {
      draft.rows = groups;
    });
  }

  /** グループ新規登録 */
  addGroup(payload: Actions.E002Payload) {
    return produce(this, (draft) => {
      draft.rows.push(payload);
    });
  }

  /** グループ削除 */
  delGroup(payload: Actions.E004Payload) {
    return produce(this, (draft) => {
      draft.rows = this.rows.filter((item) => item.id !== payload.groupId);
      draft.words = this.words.filter((item) => item.groupId !== payload.groupId);
    });
  }

  /** 単語一覧追加 */
  addWordList(payload: Actions.E005Payload) {
    return produce(this, (draft) => {
      const item = this.words.find((item) => item.groupId === payload.groupId);

      // 存在する
      if (item) {
        item.words = payload.words;
      } else {
        // 存在しない
        this.words.push({
          groupId: payload.groupId,
          words: payload.words,
        });
      }

      draft.words = this.words;
    });
  }

  /** 単語詳細情報取得 */
  setWordDetail({ res }: Actions.E006Payload) {
    return produce(this, (draft) => {
      draft.wordDetail = res;
    });
  }

  /** 単語詳細情報クリア */
  clearWordDetail() {
    return produce(this, (draft) => {
      draft.wordDetail = undefined;
    });
  }

  /** 単語削除 */
  delWord(payload: Actions.E008Payload) {
    return produce(this, (draft) => {
      const group = this.words.find((item) => item.groupId === payload.groupId);

      if (group) {
        const words = group?.words.filter((item) => item.word !== payload.word);
        group.words = words;
      }

      draft.words = this.words;
    });
  }

  // /** 取込中 */
  // startLoading() {
  //   return produce(this, (draft) => {
  //     draft.isLoading = true;
  //   });
  // }

  // endLoading() {
  //   return produce(this, (draft) => {
  //     draft.isLoading = false;
  //   });
  // }
}
