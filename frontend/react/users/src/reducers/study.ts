import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import differenceBy from 'lodash/differenceBy';
import { Consts } from '@constants';
import { Domains } from 'typings';
import { STUDY_PRACTICE, STUDY_TEST, STUDY_ANSWER } from './studyActions';

const studyState: Domains.StudyState = {
  current: undefined,
  rows: [],
  history: [],
  index: 0,
  mode: '',
};

const slice = createSlice({
  name: 'study',
  initialState: studyState,
  reducers: {
    STUDY_INIT: (state, { payload }: PayloadAction<string>) => {
      state.rows = [];
      state.history = [];
      state.current = undefined;
      state.index = 0;
      state.mode = payload;
    },
    STUDY_NEXT: (state) => {
      const newIndex = state.index + 1;
      state.index = newIndex >= state.rows.length ? 0 : newIndex;
      state.current = state.rows.length > 0 ? state.rows[0] : undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(STUDY_PRACTICE.fulfilled, STUDY_TEST.fulfilled), (state, { payload }) => {
        console.log('payload', payload, state.history);
        // 差分を抽出する
        const differ = differenceBy(payload, state.history, 'id');
        console.log('differ', differ);
        // 足りない単語数を計算する
        const diffNum = Consts.PAGE_MAX_WORDS - state.rows.length;
        // 追加する単語
        const added = differ.slice(0, diffNum);

        // 単語一覧
        state.rows = [...state.rows, ...added];
        // 学習履歴
        state.history = [...state.history, ...added];
        state.current = state.rows[state.index];
      })
      .addMatcher(isAnyOf(STUDY_ANSWER.fulfilled), (state, { payload }) => {
        // 回答正解 / テストモードの場合、対象単語を削除する
        if (payload === true || state.mode === Consts.MODES.Test) {
          // 回答を除外する
          state.rows = state.rows.filter((item) => item.id !== state.current?.id);
        } else {
          state.index += 1;
        }

        // 最後尾確認
        if (state.index >= state.rows.length) {
          state.index = 0;
        }
        // 次の単語
        state.current = state.rows[state.index];
      });

    // .addMatcher(isAnyOf(STUDY_START.fulfilled, STUDY_TODOS.fulfilled), (state, { payload: { mode, items } }) => {
    //   // 差分を抽出する
    //   const differ = differenceBy(items, state.history, 'id');
    //   // 足りない単語数を計算する
    //   const diffNum = Consts.PAGE_MAX_WORDS - state.rows.length;
    //   // 追加する単語
    //   const added = differ.splice(0, diffNum);
    //   // 既存配列と合併する
    //   const newArray = concat(state.rows, added);

    //   // モード変わった、或いは、既存データ存在しない
    //   state.rows = newArray;
    //   state.history = concat(state.history, added);
    //   state.current = state.current ? state.current : newArray[0];
    //   state.mode = mode;
    // })
    // .addMatcher(isAnyOf(STUDY_CONTINUE.fulfilled), (state, { payload: { mode, items } }) => {
    //   // 差分を抽出する
    //   const differ = differenceBy(items, state.history, 'id');
    //   // 足りない単語数を計算する
    //   const diffNum = Consts.PAGE_MAX_WORDS - state.rows.length;
    //   // 追加する単語
    //   const added = differ.splice(0, diffNum);
    //   // 既存配列と合併する
    //   const newArray = concat(state.rows, added);

    //   // モード変わった、或いは、既存データ存在しない
    //   state.rows = newArray;
    //   state.history = concat(state.history, added);
    //   state.current = state.current ? state.current : newArray[0];
    //   state.mode = mode;
    // })
    // .addMatcher(isAnyOf(STUDY_IGNORE.fulfilled), (state, { payload }) => {
    //   // remove first item
    //   const array = state.rows.filter((item) => item.id !== payload);
    //   const newIdx = state.index > array.length - 1 ? 0 : state.index;

    //   state.rows = array;
    //   state.index = newIdx;
    //   state.current = array[newIdx];
    // });
  },
});

export default slice;
