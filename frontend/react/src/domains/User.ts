import produce, { immerable } from 'immer';
import { A002Response } from 'typings/api';

export default class User {
  [immerable] = true;

  remainingTest: number = 0;
  remainingReview: number = 0;
  daily: number = 0;
  dailyNew: number = 0;
  dailyReview: number = 0;
  weekly: number = 0;
  monthly: number = 0;
  // isLoading: boolean = false;

  /**
   * 学習履歴取得
   */
  setHistory(info: A002Response) {
    return produce(this, (draft) => {
      // モード変わった、或いは、既存データ存在しない
      draft.remainingReview = info.remaining.review;
      draft.remainingTest = info.remaining.test;
      draft.daily = info.daily.total;
      draft.dailyNew = info.daily.new;
      draft.dailyReview = info.daily.review;
      draft.weekly = info.weekly;
      draft.monthly = info.monthly;
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
}
