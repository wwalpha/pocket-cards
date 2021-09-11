import { Consts } from '@constants';
import produce, { immerable } from 'immer';
import concat from 'lodash/concat';
import differenceBy from 'lodash/differenceBy';
import { Actions, App } from 'typings';

export default class Word {
  [immerable] = true;

  current?: App.WordItem = undefined;
  mode?: string = undefined;
  rows: App.WordItem[] = [];
  history: App.WordItem[] = [];
  index: number = 0;

  /**
   * 単語情報を登録する
   */
  setWords({ mode, datas }: Actions.StudyPayload) {
    return produce(this, (draft) => {
      // 差分を抽出する
      const differ = differenceBy(datas.words, this.history, 'word');
      // 足りない単語数を計算する
      const diffNum = Consts.PAGE_MAX_WORDS - this.rows.length;
      // 追加する単語
      const added = differ.splice(0, diffNum);
      // 既存配列と合併する
      const newArray = concat(this.rows, added);

      // モード変わった、或いは、既存データ存在しない
      draft.rows = newArray;
      draft.history = concat(this.history, added);
      draft.current = this.current ? this.current : newArray[0];
      draft.index = this.index;
      draft.mode = mode;
    });
  }

  /** 次の単語を表示する */
  next() {
    return produce(this, (draft) => {
      const newIdx = this.index + 1 === this.rows.length ? 0 : this.index + 1;

      // １件のみ場合、計算しない
      if (this.rows.length === 1) {
        return draft;
      }

      // 単語ループ表示する
      draft.current = this.rows[newIdx];
      draft.index = newIdx;
    });
  }

  /** テスト回答(YES/NO) */
  answer(yes: boolean) {
    if (!yes && this.mode !== Consts.MODES.AllTest) {
      return this.next();
    }

    return produce(this, (draft) => {
      // 該当単語を削除する
      const newRows = [...this.rows];
      newRows.splice(this.index, 1);

      // Indexが配列の限界を超えた場合、最初から始まる
      const newIdx = this.index >= newRows.length ? 0 : this.index;

      draft.rows = newRows;
      draft.index = newIdx;
      draft.current = newRows[newIdx];
    });
  }

  /** 既存単語をクリアする */
  clear() {
    return produce(this, (draft) => {
      draft.rows = [];
      draft.history = [];
      draft.current = undefined;
    });
  }

  /**
   * 登録しない単語を削除する
   */
  removeWord(word: string) {
    return produce(this, (draft) => {
      //@ts-ignore
      const result = this.rows.filter((item) => item !== word);

      draft.rows = result;
    });
  }
}
