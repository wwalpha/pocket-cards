import { Request } from 'express';
import { DBHelper } from '@utils';
import { Consts } from '@consts';
import { WeeklyAbility } from '@queries';
import { APIs } from 'typings';
import { GroupService } from '@services';

/** 週テスト対策の実力テストの回答 */
export default async (
  req: Request<APIs.WeeklyAbilityAnswerParameter, any, APIs.WeeklyAbilityAnswerRequest, any>
): Promise<APIs.WeeklyAbilityAnswerResponse> => {
  const { groupId, qid } = req.params;
  const { correct } = req.body;

  if (correct === Consts.ANSWER_CORRECT) {
    await DBHelper().transactWrite({
      TransactItems: [
        {
          Delete: WeeklyAbility.del({
            id: groupId,
            qid: qid,
          }),
        },
        {
          Update: GroupService.minusCountQuery(groupId, 1),
        },
      ],
    });
  }
};
