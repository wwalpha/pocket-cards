import { E001Payload, E002Payload, E004Payload } from '@actions/group';
import { E005Payload } from '@actions/word';
import { E006Payload, E008Payload } from '@actions/word/Actions';
import { immerable, produce } from 'immer';
import { E001Response } from 'typings/api';
import { GroupInfo, GroupWordsItem } from 'typings/types';

export default class AppState {
  [immerable] = true;

  groups: GroupInfo[] = [];
  words: GroupWordsItem[] = [];
  isLoading: boolean = false;
  wordDetail?: E001Response = undefined;

  /**
   * グループ一覧追加
   */
  addGroupList({ groups }: E001Payload) {
    return produce(this, (draft) => {
      draft.groups = groups;
    });
  }

  /** グループ新規登録 */
  addGroup(payload: E002Payload) {
    return produce(this, (draft) => {
      draft.groups.push(payload);
    });
  }

  /** グループ削除 */
  delGroup(payload: E004Payload) {
    return produce(this, (draft) => {
      draft.groups = this.groups.filter((item) => item.id !== payload.groupId);
      draft.words = this.words.filter((item) => item.groupId !== payload.groupId);
    });
  }

  /** 単語一覧追加 */
  addWordList(payload: E005Payload) {
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
  setWordDetail({ res }: E006Payload) {
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
  delWord(payload: E008Payload) {
    return produce(this, (draft) => {
      const group = this.words.find((item) => item.groupId === payload.groupId);

      if (group) {
        const words = group?.words.filter((item) => item.word !== payload.word);
        group.words = words;
      }

      draft.words = this.words;
    });
  }

  /** 取込中 */
  startLoading() {
    return produce(this, (draft) => {
      draft.isLoading = true;
    });
  }

  endLoading() {
    return produce(this, (draft) => {
      draft.isLoading = false;
    });
  }
}
