import { Consts } from '@constants';
import produce, { immerable } from 'immer';
import concat from 'lodash/concat';
import differenceBy from 'lodash/differenceBy';
import { APIs } from 'typings';

export default class Word {
  [immerable] = true;

  current?: APIs.WordItem = undefined;
  mode?: string = undefined;
  // isLoading: boolean = false;
  rows: APIs.WordItem[] = [];
  history: APIs.WordItem[] = [];
  index: number = 0;

  /**
   * 単語情報を登録する
   */
  setWords(mode: string, words: APIs.WordItem[]) {
    return produce(this, (draft) => {
      // 差分を抽出する
      const differ = differenceBy(words, this.history, 'word');
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
      this.rows.splice(this.index, 1);

      // Indexが配列の限界を超えた場合、最初から始まる
      const newIdx = this.index >= this.rows.length ? 0 : this.index;

      draft.rows = this.rows;
      draft.index = newIdx;
      draft.current = this.rows[newIdx];
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

  /** 取込中 */
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

  // /**
  //  * 臨時単語リストをクリアする
  //  */
  // clear() {
  //   return this.set('words', []);
  // }

  /**
   * 単語内部保存
   */
  // setWords(payload: D001Response) {
  //   return this.set('words', payload.words);
  // }
}
