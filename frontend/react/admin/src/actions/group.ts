import { push } from 'connected-react-router';
import { Consts, ROUTE_PATHS, URLs } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { showSuccess } from './app';
import { APIs, AppDispatch, Group, QuestionUpdateParameter } from 'typings';

/** グループリスト */
export const list = () => async (dispatch: AppDispatch) => {
  // グループ一覧
  await dispatch(Actions.GROUP_LIST()).unwrap();
};

/** グループ登録 */
export const regist = (datas: Group.Regist) => async (dispatch: AppDispatch) => {
  // グループ登録開始イベント
  const res = await API.post<APIs.GroupRegistResponse, APIs.GroupRegistRequest>(URLs.GroupRegist(), {
    name: datas.name,
    description: datas.description,
    subject: datas.subject,
    grade: datas.grade,
  });

  // データ保存
  dispatch(
    Actions.GROUP_REGIST({
      id: res.groupId,
      subject: datas.subject,
      grade: datas.grade,
      count: 0,
      name: datas.name,
      description: datas.description,
    })
  );

  dispatch(push(ROUTE_PATHS.GROUP_ROOT(datas.subject)));
};

/** グループ登録 */
export const remove = (id: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_REMOVE(id));
};

// clear questions
export const clearQuestions = () => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_QUESTION_CLEAR());
};

// group editable
export const editable = (mode: Consts.EDIT_MODE) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.GROUP_EDITABLE(mode));
};

/** グループ編集 */
export const edit = (details: Group.Details) => async (dispatch: AppDispatch) => {
  // グループ編集API
  await API.put<void, APIs.GroupUpdateRequest>(URLs.GROUP_UPDATE(details.id), {
    name: details.name,
    description: details.description,
    grade: details.grade,
  });

  // グループ再取得
  await dispatch(Actions.GROUP_LIST()).unwrap();

  dispatch(push(ROUTE_PATHS.GROUP_ROOT(details.subject)));
};

export const transitToGroupRegist = (subject: string) => (dispatch: AppDispatch) => {
  // enable group regist
  editable(Consts.EDIT_MODE.REGIST)(dispatch);
  // transit to group detail
  dispatch(push(ROUTE_PATHS.GROUP_REGIST(subject)));
};

/** 問題集更新 */
export const questionUpdate = (param: QuestionUpdateParameter) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_QUESTION_UPDATE(param));
};

/** 質問リスト */
export const questionList = (groupId: string, routePath: string) => async (dispatch: AppDispatch) => {
  // Get question lists
  await dispatch(Actions.GROUP_QUESTION_LIST(groupId)).unwrap();

  dispatch(push(routePath));
};

/** 質問削除 */
export const questionDelete = (groupId: string, qid: string) => async (dispatch: AppDispatch) => {
  // Get question lists
  dispatch(Actions.GROUP_QUESTION_DELETE({ groupId: groupId, questionId: qid })).unwrap();
};

/** 質問無視 */
export const questionIgnore = (groupId: string, qid: string) => async (dispatch: AppDispatch) => {
  // ignore english word
  dispatch(Actions.GROUP_QUESTION_IGNORE({ groupId: groupId, questionId: qid })).unwrap();
};

/** 質問リスト */
export const uploadConfirm = (subject: string, groupId: string, texts: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_QUESTION_UPLOADS(texts));

  // transit to upload confirm
  dispatch(push(ROUTE_PATHS.GROUP_UPLOAD_CONFIRM_PUSH(subject, groupId)));
};

/** 質問リスト */
export const uploadQuestions = (subject: string, groupId: string) => async (dispatch: AppDispatch) => {
  // regist questions
  await dispatch(Actions.GROUP_QUESTION_REGIST(groupId)).unwrap();

  // Get question lists
  await dispatch(Actions.GROUP_QUESTION_LIST(groupId)).unwrap();

  // transit to upload confirm
  dispatch(push(ROUTE_PATHS.GROUP_QUESTIONS(subject, groupId)));
};

export const registWeekly = (request: APIs.WeeklyRegistRequest) => async (dispatch: AppDispatch) => {
  // regist questions
  await dispatch(Actions.GROUP_WEEKLY_REGIST(request)).unwrap();
};
