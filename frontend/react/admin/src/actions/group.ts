import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Consts, ROUTE_PATHS, URLs } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { APIs, AppDispatch, Group, QuestionUpdateParameter } from 'typings';

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

      dispatch(push(ROUTE_PATHS.GROUP_ROOT(datas.subject)));
    })
  );

/** グループ登録 */
export const remove = (id: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      dispatch(Actions.GROUP_REMOVE(id));
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
export const edit = (details: Group.Details) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ編集API
      await API.put<void, APIs.GroupUpdateRequest>(URLs.GROUP_UPDATE(details.id), {
        name: details.name,
        description: details.description,
      });

      // グループ再取得
      await dispatch(Actions.GROUP_LIST()).unwrap();

      dispatch(push(ROUTE_PATHS.GROUP_ROOT(details.subject)));
    })
  );

export const transitToGroupRegist = (subject: string) => (dispatch: AppDispatch) => {
  // enable group regist
  editable(Consts.EDIT_MODE.REGIST)(dispatch);
  // transit to group detail
  dispatch(push(ROUTE_PATHS.GROUP_REGIST(subject)));
};

/** 問題集更新 */
export const questionUpdate = (param: QuestionUpdateParameter) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      dispatch(Actions.GROUP_QUESTION_UPDATE(param));
    })
  );

/** 質問リスト */
export const questionList = (subject: string, groupId: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST(groupId)).unwrap();
      // move to page
      dispatch(push(ROUTE_PATHS.GROUP_QUESTIONS(subject, groupId)));
    })
  );

/** 質問リスト */
export const uploadConfirm = (texts: string) => (dispatch: AppDispatch) => {
  dispatch(Actions.GROUP_QUESTION_UPLOADS(texts));

  // transit to upload confirm
  dispatch(push(ROUTE_PATHS.QUESTION_CONFIRM));
};

/** 質問リスト */
export const uploadQuestions = (subject: string, groupId: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // regist questions
      await dispatch(Actions.GROUP_QUESTION_REGIST(groupId)).unwrap();

      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST(groupId)).unwrap();

      // transit to upload confirm
      dispatch(push(ROUTE_PATHS.GROUP_QUESTIONS(subject, groupId)));
    })
  );

export const registAbility = (request: APIs.WeeklyAbilityRegistRequest) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // regist questions
      await dispatch(Actions.GROUP_ABILITY_REGIST(request)).unwrap();

      // transit to upload confirm
      dispatch(push(ROUTE_PATHS.ABILITIES));
    })
  );
