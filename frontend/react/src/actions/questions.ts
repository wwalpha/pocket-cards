import { withLoading } from '@actions';
import { Consts } from '@constants';
import { API } from '@utils';
import { APIs, AppDispatch } from 'typings';

/** グループ登録 */
export const update =
  (groupId: string, questionId: string, request: APIs.QuestionUpdateRequest) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(async () => {
        // グループ登録開始イベント
        await API.put<APIs.QuestionUpdateResponse, APIs.QuestionUpdateRequest>(
          Consts.QUESTION_UPDATE(groupId, questionId),
          request
        );
      })
    );
