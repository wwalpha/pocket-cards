import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Tables, APIs, Payloads, Group } from 'typings';

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
        id: item.id,
        original: item.word,
        vocabulary: item.vocabulary,
      })),
    };
  }
);

export const GROUP_WORD_DETAILS = createAsyncThunk<Group.WordDetails, string>(
  'group/GROUP_WORD_DETAILS',
  async (word, { rejectWithValue }) => {
    try {
      const res = await API.get<APIs.E001Response>(Consts.E001_URL(word));

      if (!res.item) {
        return rejectWithValue(`Cannot found word: ${word}`);
      }

      return {
        id: word,
        original: res.item.original,
        mp3: res.item?.mp3,
        pronounce: res.item?.pronounce,
        vocabulary: res.item?.vocJpn,
        vocChn: res.item?.vocChn,
        vocJpn: res.item?.vocJpn,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const GROUP_STATUS = createAsyncThunk<Group.Status, void>('group/GROUP_STATUS', async (_, { getState }) => {
  const { activeGroup } = (getState() as RootState).group;

  const res = await API.get<APIs.B006Response>(Consts.B006_URL(activeGroup));

  return res;
});
