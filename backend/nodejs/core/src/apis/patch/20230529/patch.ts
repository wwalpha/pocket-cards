import { Environment } from '@consts';
import { LearningService } from '@services';
import { DBHelper } from '@utils';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';

  const [learnings] = await Promise.all([
    // LearningService.listByUser(userId, 'xdCeUT337zFLUecrVLR7RV'),
    // LearningService.listByUser(userId, 'btWiokeG73MG5kzp1TT1KN'),
    LearningService.listByUser(userId, 'iyPV3R4qYrLAFcpYRTgYUT'),
  ]);

  learnings.forEach((item) => {
    item.nextTime = '20230528';
    item.times = 3;
  });

  // await Promise.all(learnings.map((item) => LearningService.update(item)));

  // clear status
  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, learnings);
};

patch();