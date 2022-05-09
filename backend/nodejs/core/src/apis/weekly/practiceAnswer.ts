import { Request } from 'express';
import { DBHelper, ValidationError } from '@utils';
import { WeeklyAbility } from '@queries';
import { APIs, Tables } from 'typings';

/** 週テスト対策の練習問題の回答 */
export default async (
  req: Request<APIs.WeeklyAbilityPracticeAnswerParameter, any, APIs.WeeklyAbilityPracticeAnswerRequest, any>
): Promise<APIs.WeeklyAbilityPracticeAnswerResponse> => {
  const { groupId, qid } = req.params;
  const { correct } = req.body;

  const result = await DBHelper().get<Tables.TWeeklyAbility>(WeeklyAbility.get({ id: groupId, qid: qid }));
  const question = result?.Item;

  if (!question) {
    throw new ValidationError(`Question not found. ${qid}`);
  }

  // 正解の場合
  const times = correct === '1' ? question.times + 1 : question.times;

  if (times === 3) {
    await DBHelper().put(
      WeeklyAbility.put({
        ...question,
        times: -1,
      })
    );
  } else {
    await DBHelper().put(
      WeeklyAbility.put({
        ...question,
        times,
      })
    );
  }
};
