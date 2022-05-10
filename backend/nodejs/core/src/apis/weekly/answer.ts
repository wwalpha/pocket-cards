import { Request } from 'express';
import { Consts } from '@consts';
import { AbilityService, GroupService } from '@services';
import { APIs } from 'typings';
import { ValidationError } from '@utils';

/** 週テスト対策の実力テストの回答 */
export default async (
  req: Request<APIs.WeeklyAbilityAnswerParameter, any, APIs.WeeklyAbilityAnswerRequest, any>
): Promise<APIs.WeeklyAbilityAnswerResponse> => {
  const { groupId, questionId: qid } = req.params;
  const { correct, mode } = req.body;

  // 実力テストモード
  if (mode === 'test') {
    if (correct === Consts.ANSWER_CORRECT) {
      await AbilityService.remove(groupId, qid);
      await GroupService.minusCount(groupId, 1);
    }
  }

  // 練習問題モード
  if (mode === 'practice') {
    const question = await AbilityService.describe(groupId, qid);

    if (!question) {
      throw new ValidationError(`Question not found. ${qid}`);
    }

    // 正解の場合
    const times = correct === '1' ? question.times + 1 : question.times;

    if (times === 3) {
      await AbilityService.update({
        ...question,
        times: -1,
      });
    } else {
      await AbilityService.update({
        ...question,
        times,
      });
    }
  }
};
