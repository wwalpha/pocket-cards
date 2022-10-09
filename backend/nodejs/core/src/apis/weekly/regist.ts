import { Request } from 'express';
import { GroupService, LearningService } from '@services';
import { ValidationError } from '@utils';
import { APIs } from 'typings';

/** 週テスト対策問題登録 */
export default async (req: Request<any, any, APIs.WeeklyRegistRequest, any>): Promise<APIs.WeeklyRegistResponse> => {
  // next study date
  const { student, groupIds } = req.body;

  if (!student || !groupIds || groupIds.length === 0) {
    throw new ValidationError('Group id is required.');
  }

  // グループ毎の問題を更新する
  const tasks = groupIds.map(async (item) => {
    const groupInfo = await GroupService.describe(item);

    // validation check
    if (!groupInfo) {
      throw new ValidationError('Group is not exists.');
    }

    // 対象
    const questions = await LearningService.listByUser(student, item);

    // weekly = 'on' を設定する
    const tasks = questions.map((item) => {
      item.subject_weekly = `${item.subject}_ON`;

      return LearningService.update(item);
    });

    // 一括実行
    await Promise.all(tasks);
  });

  // 一括実行
  await Promise.all(tasks);
};
