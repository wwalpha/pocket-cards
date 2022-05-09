import { Request } from 'express';
import { ValidationError } from '@utils';
import { APIs } from 'typings';
import { AbilityService } from '@services';

/** 週テスト対策の練習問題の回答 */
export default async (
  req: Request<APIs.WeeklyAbilityPracticeAnswerParameter, any, APIs.WeeklyAbilityPracticeAnswerRequest, any>
): Promise<APIs.WeeklyAbilityPracticeAnswerResponse> => {
  const { groupId, qid } = req.params;
  const { correct } = req.body;

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
};
