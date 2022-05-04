import { push } from 'connected-react-router';
import { AppActions, withLoading } from '@actions';
import { Consts, Paths, URLs } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { APIs, AppDispatch, Group } from 'typings';

/** グループリスト */
export const list = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ一覧
      await dispatch(Actions.GROUP_LIST()).unwrap();
    })
  );

/** グループ登録 */
export const regist = (datas: Group.Regist) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ登録開始イベント
      const res = await API.post<APIs.GroupRegistResponse, APIs.GroupRegistRequest>(URLs.GroupRegist(), {
        name: datas.name,
        description: datas.description,
        subject: datas.subject,
      });

      // データ保存
      dispatch(
        Actions.GROUP_REGIST({
          id: res.groupId,
          subject: datas.subject,
          count: 0,
          name: datas.name,
          description: datas.description,
        })
      );

      dispatch(push(Paths.PATHS_ROOT));
    })
  );

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
export const edit = (details: Omit<Group.Details, 'subject'>) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ編集API
      await API.put<void, APIs.GroupUpdateRequest>(URLs.GroupUpdate(details.id), {
        name: details.name,
        description: details.description,
      });

      // グループ再取得
      await dispatch(Actions.GROUP_LIST()).unwrap();

      dispatch(push(Paths.PATHS_ROOT));
    })
  );

export const transitToGroupRegist = () => (dispatch: AppDispatch) => {
  // enable group regist
  editable(Consts.EDIT_MODE.REGIST)(dispatch);
  // remove active group
  AppActions.activeGroup('')(dispatch);
  // transit to group detail
  dispatch(push(Paths.PATHS_GROUP_LIST));
};

/** 問題集更新 */
export const questionUpdate = (questionId: string, request: APIs.QuestionUpdateRequest) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      dispatch(
        Actions.GROUP_QUESTION_UPDATE({
          questionId: questionId,
          title: request.title,
          answer: request.answer,
        })
      );
    })
  );

/** 質問リスト */
export const questionList = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST()).unwrap();

      dispatch(push(Paths.PATHS_QUESTION_LIST));
    })
  );

/** 質問リスト */
export const uploadConfirm = (texts: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_QUESTION_UPLOADS(texts));

  // transit to upload confirm
  dispatch(push(Paths.PATHS_QUESTION_CONFIRM));
};

/** 質問リスト */
export const uploadQuestions = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // regist questions
      await dispatch(Actions.GROUP_QUESTION_REGIST()).unwrap();

      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST()).unwrap();

      // transit to upload confirm
      dispatch(push(Paths.PATHS_QUESTION_LIST));
    })
  );
