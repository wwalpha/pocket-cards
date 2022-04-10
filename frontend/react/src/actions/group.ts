import { push } from 'connected-react-router';
import { withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { APIs, AppDispatch, Group } from 'typings';

export const activeGroup = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.GROUP_ACTIVE(id));
};

export const cleanGroup = () => (dispatch: AppDispatch) => {
  // group clean
  dispatch(Actions.GROUP_CLEAN());
};

/** グループ削除 */
export const del = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ削除
      await dispatch(Actions.GROUP_DELETE()).unwrap();
      // グループリスト画面に遷移する
      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
    })
  );

/** グループリスト */
export const list = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ一覧
      await dispatch(Actions.GROUP_LIST()).unwrap();
    })
  );

/** グループ登録 */
export const regist = (details: Group.Details) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ登録開始イベント
      const res = await API.put<APIs.GroupRegistResponse, APIs.GroupRegistRequest>(Consts.B001_URL(), {
        name: details.name,
        description: details.description,
        subject: details.subject,
      });

      // データ保存
      dispatch(
        Actions.GROUP_REGIST({
          id: res.groupId,
          subject: details.subject,
          count: 0,
          name: details.name,
          description: details.description,
        })
      );

      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
    })
  );

/** グループリスト */
export const search = (word: string) => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ一覧
      dispatch(Actions.GROUP_WORD_SEARCH(word));
    })
  );

/** グループ学習状態 */
export const status = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // グループ一覧
      dispatch(Actions.GROUP_STATUS()).unwrap();

      dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyStatus]));
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
      await API.put<void, APIs.GroupUpdateRequest>(Consts.GroupUpdate(details.id), {
        name: details.name,
        description: details.description,
      });

      // グループ再取得
      await dispatch(Actions.GROUP_LIST()).unwrap();

      dispatch(push(Paths.PATHS_ADMIN_DASHBOARD));
    })
  );

/** グループ編集 */
// export const edit = (details: Group.Details) => (dispatch: AppDispatch) =>
//   dispatch(
//     withLoading(async () => {
//       // グループ編集API
//       await API.put<void, APIs.GroupUpdateRequest>(Consts.GroupUpdate(details.id), {
//         name: details.name,
//         description: details.description,
//       });

//       // グループ再取得
//       await dispatch(Actions.GROUP_LIST()).unwrap();
//       // グループリスト画面に遷移する
//       dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]));
//     })
//   );
