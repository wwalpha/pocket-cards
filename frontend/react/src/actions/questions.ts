import { withLoading } from '@actions';
import { Actions } from '@reducers';
import { APIs, AppDispatch } from 'typings';

/** グループ登録 */
export const update = (questionId: string, request: APIs.QuestionUpdateRequest) => (dispatch: AppDispatch) =>
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
