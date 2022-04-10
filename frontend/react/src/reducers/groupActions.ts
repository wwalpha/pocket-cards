import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Tables, APIs, Payloads, Group } from 'typings';

export const GROUP_LIST = createAsyncThunk<Tables.TGroups[]>('group/GROUP_LIST', async () => {
  const res = await API.get<APIs.GroupListResponse>(Consts.B002_URL());

  return res.items;
});

export const GROUP_DELETE = createAsyncThunk<void, void>('group/GROUP_DELETE', async (_, { getState }) => {
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
        groupId: groupId,
        vocabulary: item.vocabulary,
      })),
    };
  }
);

export const GROUP_WORD_DETAILS = createAsyncThunk<Group.WordDetails, Group.WordSimple>(
  'group/GROUP_WORD_DETAILS',
  async (details, { rejectWithValue }) => {
    try {
      const res = await API.get<APIs.E001Response>(Consts.E001_URL(details.id));

      if (!res.item) {
        return rejectWithValue(`Cannot found word: ${details.id}`);
      }

      return {
        id: details.id,
        groupId: details.groupId,
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

/** Question List */
export const GROUP_QUESTION_LIST = createAsyncThunk<Group.Question[], void>(
  'group/GROUP_QUESTION_LIST',
  async (_, { getState }) => {
    const { activeGroup } = (getState() as RootState).group;
    // request
    const res = await API.get<APIs.QuestionListResponse>(Consts.QUESTION_LIST(activeGroup));

    // response
    return res.questions.map((item) => ({
      id: item.id,
      title: item.title,
      answer: item.answer,
    }));
  }
);

/** Question List */
export const GROUP_QUESTION_REGIST = createAsyncThunk<void, string>(
  'group/GROUP_QUESTION_REGIST',
  async (texts, { getState }) => {
    // request parameter
    const { activeGroup } = (getState() as RootState).group;
    const questions = texts.split('\n');

    const jsonQuestions = questions
      .filter((item) => item !== '')
      .map((item) => {
        const line = item.split('|');
        return `${line[0]},,,${line[1]}`;
      });

    // request
    await API.post<APIs.QuestionRegistRequest, APIs.QuestionRegistResponse>(Consts.QUESTION_REGIST(activeGroup), {
      questions: jsonQuestions,
    });
  }
);
