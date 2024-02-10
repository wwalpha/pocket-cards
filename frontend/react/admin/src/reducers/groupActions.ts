import { createAsyncThunk } from '@reduxjs/toolkit';
import { Consts, URLs } from '@constants';
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
    const { uploads, groups } = (getState() as RootState).group;
    const subject = groups.find((g) => g.id === groupId)?.subject;

    let questions: string[] = [];

    // 算数の場合
    if (subject === Consts.SUBJECT.MATHS) {
      questions = uploads.map(
        ({ title, answer, description, source, category, tags, difficulty, qNo }) =>
          `${description}|${source}|${category}|${tags}|${difficulty}|${qNo}|${title}|${answer}`
      );
    } else {
      // 算数以外の場合
      questions = uploads.map(
        ({ title, answer, description, choices }) =>
          `${title},${description ?? ''},${choices?.join('|') ?? ''},${answer ?? ''}`
      );
    }

    for (; questions.length > 0; ) {
      const datas = questions.splice(0, 1);

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

/** Question Download */
export const GROUP_QUESTION_DOWNLOAD = createAsyncThunk<void, string>(
  'group/GROUP_QUESTION_DOWNLOAD',
  async (groupId, { getState }) => {
    // request parameter
    const { questions, groups } = (getState() as RootState).group;

    const targets = questions.filter((item) => item.groupId === groupId);
    const group = groups.find((item) => item.id === groupId);
    const datas = targets
      .map((item) => {
        if (item.subject === Consts.SUBJECT.JAPANESE) {
          return [item.title, item.choices, item.answer].join(',');
        }

        return [item.title, item.answer].join(',');
      })
      .join('\n');

    //BOMを付与する（Excelでの文字化け対策）
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, datas], { type: 'text/csv' });

    //BlobからオブジェクトURLを作成する
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    //ダウンロード用にリンクを作成する
    const download = document.createElement('a');
    //リンク先に上記で生成したURLを指定する
    download.href = url;
    //download属性にファイル名を指定する
    download.download = group?.name + '.csv';
    //作成したリンクをクリックしてダウンロードを実行する
    download.click();
    //createObjectURLで作成したオブジェクトURLを開放する
    (window.URL || window.webkitURL).revokeObjectURL(url);
  }
);
