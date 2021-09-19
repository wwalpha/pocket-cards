import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { API } from '@utils';
import { APIs, Domains, Payloads, RootState, Tables } from 'typings';

export const GROUP_LIST = createAsyncThunk<Tables.TGroups[]>('group/GROUP_LIST', async () => {
  const res = await API.get<APIs.B002Response>(Consts.B002_URL());

  return res.items;
});

export const GROUP_DELETE = createAsyncThunk<void, void>('group/GROUP_DELETE', async (_, { getState }) => {
  console.log((getState() as RootState).group);
  const { activeGroup } = (getState() as RootState).group;

  await API.del(Consts.B005_URL(activeGroup));
});

export const GROUP_WORD_LIST = createAsyncThunk<Payloads.GroupWordList, string>(
  'group/GROUP_WORD_LIST',
  async (groupId) => {
    const res = await API.get<APIs.C002Response>(Consts.C002_URL(groupId));

    return {
      id: groupId,
      items: res.items.map((item) => ({
        id: item.word,
        vocabulary: item.vocabulary,
      })),
    };
  }
);

const grpState: Domains.GroupState = {
  activeGroup: '',
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
    },

    // グループ登録
    GROUP_REGIST: (state, { payload }: PayloadAction<Tables.TGroups>) => {
      state.groups.push(payload);
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
      });
  },
});

export default slice;
