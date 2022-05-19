import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Tables, APIs, Group, QuestionUpdateParameter } from 'typings';
import omit from 'lodash/omit';

export const GROUP_LIST = createAsyncThunk<Tables.TGroups[]>('group/GROUP_LIST', async () => {
  const res = await API.get<APIs.GroupListResponse>(URLs.GroupList());

  return res.items;
});

export const GROUP_REMOVE = createAsyncThunk<string, string>('group/GROUP_REMOVE', async (id) => {
  // グループ削除
  await API.del(URLs.GROUP_REMOVE(id));

  return id;
});

/** Question List */
export const GROUP_QUESTION_LIST = createAsyncThunk<Group.Question[], string>(
  'group/GROUP_QUESTION_LIST',
  async (groupId) => {
    // request
    const res = await API.get<APIs.QuestionListResponse>(URLs.QUESTION_LIST(groupId));

    // response
    return res.questions.map((item) => ({
      id: item.id,
      title: item.title,
      answer: item.answer,
      description: item.description,
      choices: item.choices,
      voiceAnswer: item.voiceAnswer,
      voiceTitle: item.voiceTitle,
    }));
  }
);

/** Question List */
export const GROUP_QUESTION_REGIST = createAsyncThunk<void, string>(
  'group/GROUP_QUESTION_REGIST',
  async (groupId, { getState }) => {
    // request parameter
    const { uploads } = (getState() as RootState).group;

    // request
    await API.post<APIs.QuestionRegistRequest, APIs.QuestionRegistResponse>(URLs.QUESTION_REGIST(groupId), {
      questions: uploads.map(
        ({ title, answer, description, choices }) =>
          `${title},${description ?? ''},${choices?.join('|') ?? ''},${answer}`
      ),
    });
  }
);

/** Question Update */
export const GROUP_QUESTION_UPDATE = createAsyncThunk<APIs.QuestionUpdateResponse, QuestionUpdateParameter>(
  'group/GROUP_QUESTION_UPDATE',
  async (request) => {
    // request parameter
    const { groupId, questionId } = request;
    const req = omit<QuestionUpdateParameter, ['questionId', 'groupId']>(request, 'questionId', 'groupId');

    // 質問更新
    return await API.put<APIs.QuestionUpdateResponse, APIs.QuestionUpdateRequest>(
      URLs.QUESTION_UPDATE(groupId, questionId),
      req
    );
  }
);

/** Question Update */
export const GROUP_ABILITY_REGIST = createAsyncThunk<APIs.WeeklyAbilityRegistResponse, APIs.WeeklyAbilityRegistRequest>(
  'group/GROUP_ABILITY_REGIST',
  async (request) => {
    // 質問更新
    return await API.post<APIs.WeeklyAbilityRegistResponse, APIs.WeeklyAbilityRegistRequest>(
      URLs.STUDY_WEEKLY_REGIST(),
      request
    );
  }
);
