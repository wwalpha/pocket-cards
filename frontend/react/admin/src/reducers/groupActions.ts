import { createAsyncThunk } from '@reduxjs/toolkit';
import { URLs } from '@constants';
import { RootState } from '@store';
import { API } from '@utils';
import { Tables, APIs, QuestionUpdateParameter, QuestionTransferParameter } from 'typings';
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
export const GROUP_QUESTION_LIST = createAsyncThunk<Tables.TQuestions[], string>(
  'group/GROUP_QUESTION_LIST',
  async (groupId) => {
    // request
    const res = await API.get<APIs.QuestionListResponse>(URLs.QUESTION_LIST(groupId));

    // response
    return res.questions;
  }
);

export const GROUP_QUESTION_DELETE = createAsyncThunk<string, { groupId: string; questionId: string }>(
  'group/GROUP_QUESTION_DELETE',
  async ({ groupId, questionId }) => {
    // request
    await API.del<APIs.QuestionDeleteResponse>(URLs.QUESTION_DELETE(groupId, questionId));

    return questionId;
  }
);

export const GROUP_QUESTION_IGNORE = createAsyncThunk<string, { groupId: string; questionId: string }>(
  'group/GROUP_QUESTION_IGNORE',
  async ({ groupId, questionId }) => {
    // request
    await API.post<APIs.QuestionIgnoreResponse, APIs.QuestionIgnoreRequest>(URLs.QUESTION_IGNORE(groupId), {
      qid: questionId,
    });

    return questionId;
  }
);

/** Question List */
export const GROUP_QUESTION_REGIST = createAsyncThunk<void, string>(
  'group/GROUP_QUESTION_REGIST',
  async (groupId, { getState }) => {
    // request parameter
    const { uploads } = (getState() as RootState).group;

    const questions = uploads.map(
      ({ title, answer, description, choices }) =>
        `${title},${description ?? ''},${choices?.join('|') ?? ''},${answer ?? ''}`
    );

    for (; questions.length > 0; ) {
      const datas = questions.splice(0, 100);

      // request
      await API.post<APIs.QuestionRegistResponse, APIs.QuestionRegistRequest>(URLs.QUESTION_REGIST(groupId), {
        questions: datas,
      });
    }
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

/** Question Transfer */
export const GROUP_QUESTION_TRANSFER = createAsyncThunk<string, QuestionTransferParameter>(
  'group/GROUP_QUESTION_TRANSFER',
  async (params) => {
    // request parameter
    const { newGroupId, groupId, questionId } = params;

    // 質問更新
    await API.post<APIs.QuestionTransferResponse, APIs.QuestionTransferRequest>(
      URLs.QUESTION_TRANSFER(groupId, questionId),
      {
        newGroupId: newGroupId,
      }
    );

    return questionId;
  }
);

/** Question Update */
export const GROUP_WEEKLY_REGIST = createAsyncThunk<void, APIs.WeeklyRegistRequest>(
  'group/GROUP_WEEKLY_REGIST',
  async (request) => {
    // 質問更新
    await API.post<APIs.WeeklyRegistResponse, APIs.WeeklyRegistRequest>(URLs.STUDY_WEEKLY_REGIST(), request);
  }
);
