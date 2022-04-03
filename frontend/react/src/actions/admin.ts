import { withLoading } from '@actions';
import { Consts, Paths } from '@constants';
import { Actions } from '@reducers';
import { API } from '@utils';
import { push } from 'connected-react-router';
import { APIs, AppDispatch, Group } from 'typings';

export const selectGroup = (id: string) => (dispatch: AppDispatch) => {
  // active group
  dispatch(Actions.GROUP_ACTIVE(id));
};

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

/** 質問リスト */
export const questionList = () => (dispatch: AppDispatch) =>
  dispatch(
    withLoading(async () => {
      // Get question lists
      await dispatch(Actions.GROUP_QUESTION_LIST()).unwrap();

      dispatch(push(Paths.PATHS_ADMIN_GROUP_QUESTIONS));
    })
  );
