import { Request } from 'express';
import { GroupService, LearningService } from '@services';
import { ValidationError } from '@utils';
import { APIs } from 'typings';

/** 週テスト対策問題登録 */
export default async (req: Request<any, any, APIs.WeeklyRegistRequest, any>): Promise<APIs.WeeklyRegistResponse> => {
  // next study date
  const { student, groupId } = req.body;

  if (!student || !groupId) {
    throw new ValidationError('Group id is required.');
  }

  const groupInfo = await GroupService.describe(groupId);

  // validation check
  if (!groupInfo) {
    throw new ValidationError('Group is not exists.');
  }

  // 対象
  const questions = await LearningService.listByUser(student, groupId);

  // weekly = 'on' を設定する
  const tasks = questions.map((item) => {
    item.subject_weekly = `${item.subject}_ON`;

    return LearningService.update(item);
  });

  // 一括実行
  await Promise.all(tasks);
};
