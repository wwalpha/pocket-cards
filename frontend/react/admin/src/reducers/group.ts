import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, Tables } from 'typings';
import { Consts } from '@constants';
import {
  GROUP_LIST,
  GROUP_QUESTION_DELETE,
  GROUP_QUESTION_IGNORE,
  GROUP_QUESTION_LIST,
  GROUP_QUESTION_TRANSFER,
  GROUP_QUESTION_UPDATE,
  GROUP_REMOVE,
} from './groupActions';
import sortBy from 'lodash/sortBy';

const grpState: Domains.GroupState = {
  groups: [],
  editable: -1,
  questions: [],
  uploads: [],
};

const slice = createSlice({
  name: 'group',
  initialState: grpState,
  reducers: {
    // グループ編集モード
    GROUP_EDITABLE: (state, { payload }: PayloadAction<Consts.EDIT_MODE>) => {
      state.editable = payload;
    },

    // グループ登録
    GROUP_REGIST: (state, { payload }: PayloadAction<Tables.TGroups>) => {
      state.groups.push(payload);
    },

    // 単語登録一覧をクリア
    GROUP_QUESTION_CLEAR: (state) => {
      state.uploads = [];
    },

    // アップロード一覧を保存する
    GROUP_QUESTION_UPLOADS: (
      state,
      { payload: { subject, texts } }: PayloadAction<{ subject: string; texts: string }>
    ) => {
      const strLf = '\n';
      const strRfLf = '\r\n';
      const newLine = texts.split(strRfLf).length === 1 ? strLf : strRfLf;
      const questions = texts.split(newLine);

      const jsonQuestions = questions
        .filter((item) => item !== '')
        .map((item) => {
          // 算数の場合
          // if (subject === Consts.SUBJECT.MATHS) {
          //   const columns = item.split('|');

          //   return {
          //     title: columns[7],
          //     description: columns[0],
          //     source: columns[1],
          //     category: columns[2],
          //     tags: columns[3]?.split(','),
          //     difficulty: columns[4],
          //     qNo: columns[5],
          //     answer: columns[6],
          //   };
          // }

          // 算数以外の場合
          let items = item.split(',');

          // 選択肢がある場合
          if (items.length === 4) {
            return {
              title: items[0],
              description: items[1],
              choices: items[2].split('|'),
              answer: items[3],
            };
          }

          // 選択肢がない場合
          items = item.split('|');

          return {
            title: items[0],
            answer: items[1],
          };
        });

      state.uploads = jsonQuestions;
    },
  },
  extraReducers: (builder) => {
    builder
      // get group list
      .addCase(GROUP_LIST.fulfilled, (state, { payload }) => {
        // sort by name
        if (payload) {
          state.groups = sortBy(payload, ['name']);
        } else {
          state.groups = payload;
        }
      })
      .addCase(GROUP_QUESTION_LIST.fulfilled, (state, { payload }) => {
        state.questions = payload;
      })
      .addCase(GROUP_REMOVE.fulfilled, (state, { payload }) => {
        state.groups = state.groups.filter((item) => item.id !== payload);
      })
      .addCase(GROUP_QUESTION_UPDATE.fulfilled, (state, { payload }) => {
        const qIndex = state.questions.findIndex((item) => item.id === payload.id);

        // 存在しない場合は更新しない
        if (qIndex === -1) return;

        const newQuestion = {
          ...state.questions[qIndex],
          ...payload,
        };

        state.questions[qIndex] = newQuestion;
      })
      .addCase(GROUP_QUESTION_DELETE.fulfilled, (state, { payload }) => {
        state.questions = state.questions.filter((item) => item.id !== payload);
      })
      .addCase(GROUP_QUESTION_IGNORE.fulfilled, (state, { payload }) => {
        state.questions = state.questions.filter((item) => item.id !== payload);
      })
      .addCase(GROUP_QUESTION_TRANSFER.fulfilled, (state, { payload }) => {
        state.questions = state.questions.filter((item) => item.id !== payload);
      });
  },
});

export default slice;
