import { History } from 'history';
import { APP } from 'typings';

export { default as startNew } from './startNew';
export { default as startReview } from './startReview';
export { default as startTest } from './startTest';
export { default as answer } from './answer';

// ------------------------------------------------------------
// TypeScript Definetion
// ------------------------------------------------------------

/** 単語学習画面のActions */
export interface Actions {
  /** 新規単語学習 */
  startNew: (history: History<any>) => void;
  /** テスト回答(YES/NO) */
  answer: (word: string, yes: boolean) => APP.AnswerAction;
  /** 単語復習 */
  startReview: (history: History<any>) => APP.StartReviewAction;
  /** 単語テスト（全部）*/
  startTest: (history: History<any>) => APP.StartTestAction;
}
