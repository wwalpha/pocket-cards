import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Domains, Payloads, Tables } from 'typings';
import { GROUP_DELETE, GROUP_LIST, GROUP_WORD_DETAILS, GROUP_WORD_LIST, GROUP_WORD_REPLACE } from './groupActions';

const grpState: Domains.GroupState = {
  activeGroup: '',
  activeGroupList: [],
  groupWords: {},
  groups: [],
  regists: [],
  current: undefined,
};

const slice = createSlice({
  name: 'group',
  initialState: grpState,
  reducers: {
    // グループを選択
    GROUP_ACTIVE: (state, { payload }: PayloadAction<string>) => {
      state.activeGroup = payload;
      state.activeGroupList = state.groupWords[payload];
    },

    // グループ登録
    GROUP_REGIST: (state, { payload }: PayloadAction<Tables.TGroups>) => {
      state.groups.push(payload);
    },

    // グループ単語の検索
    GROUP_WORD_SEARCH: (state, { payload }: PayloadAction<string>) => {
      const { activeGroup, groupWords } = state;

      if (payload.trim().length === 0) {
        state.activeGroupList = groupWords[activeGroup];
      } else {
        const items = groupWords[activeGroup].filter((item) => item.id.indexOf(payload) !== -1);
        state.activeGroupList = items;
      }
    },

    // グループ単語の削除
    GROUP_WORD_REMOVE: (state, { payload: { id, word } }: PayloadAction<Payloads.RemoveWordInGroup>) => {
      const newItems = state.groupWords[id].filter((item) => item.id !== word);

      state.groupWords[id] = newItems;
    },

    // グループ単語の詳細
    GROUP_WORD_DETAILS: (state, { payload }: PayloadAction<Payloads.GroupWordDetails>) => {
      state.current = payload;
    },

    // グループ単語の詳細
    GROUP_WORD_UPDATE: (state, { payload }: PayloadAction<Payloads.GroupWordUpdate>) => {
      const items = state.groupWords[state.activeGroup];

      // remove old word and add new word
      const oldIndex = items.findIndex((item) => item.id === payload.old);
      items[oldIndex] = payload.details;

      state.groupWords[state.activeGroup] = items;
    },

    // 登録単語一覧を保管
    GROUP_REGIST_SAVE: (state, { payload }: PayloadAction<string[]>) => {
      state.regists = payload.filter((item) => item.trim().length > 0);
    },

    // 単語登録一覧をクリア
    GROUP_REGIST_CLEAR: (state) => {
      state.regists = [];
    },

    // 単語登録一覧をクリア
    GROUP_REGIST_REMOVE: (state, { payload }: PayloadAction<string>) => {
      state.regists = state.regists.filter((item) => item !== payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // get group list
      .addCase(GROUP_LIST.fulfilled, (state, { payload }) => {
        state.groups = payload;
      })
      // delete group id
      .addCase(GROUP_DELETE.fulfilled, (state) => {
        state.groups = state.groups.filter((item) => item.id !== state.activeGroup);
      })
      // add words in group
      .addCase(GROUP_WORD_LIST.fulfilled, (state, { payload }) => {
        state.groupWords[payload.id] = payload.items;
      })
      .addCase(GROUP_WORD_DETAILS.pending, (state) => {
        state.current = undefined;
      })
      .addCase(GROUP_WORD_DETAILS.fulfilled, (state, { payload }) => {
        state.current = payload;
      });
  },
});

export default slice;
