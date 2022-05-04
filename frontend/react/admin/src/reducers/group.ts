import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, Tables } from 'typings';
import { Consts } from '@constants';
import { GROUP_LIST, GROUP_QUESTION_LIST, GROUP_QUESTION_UPDATE } from './groupActions';
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
    GROUP_QUESTION_UPLOADS: (state, { payload }: PayloadAction<string>) => {
      const strLf = '\n';
      const strRfLf = '\r\n';
      const newLine = payload.split(strRfLf).length === 1 ? strLf : strRfLf;
      const questions = payload.split(newLine);

      const jsonQuestions = questions
        .filter((item) => item !== '')
        .map((item) => {
          let items = item.split(',');

          if (items.length === 4) {
            return {
              title: items[0],
              description: items[1],
              choices: items[2].split('|'),
              answer: items[3],
            };
          }

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
      .addCase(GROUP_QUESTION_UPDATE.fulfilled, (state, { payload }) => {
        const question = state.questions.find((item) => item.id === payload.id);

        // 存在しない場合は更新しない
        if (!question) return;

        question.title = payload.title;
        question.answer = payload.answer;
      });
  },
});

export default slice;
