import { LearningService } from '@services';
import pLimit from 'p-limit';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';

  const learnings = await LearningService.listByUser(userId);

  const targets = learnings
    .filter((item) => item.subject === '1')
    .filter((item) => item.times === 1)
    .filter((item) => item.lastTime === '19900101');

  const limit = pLimit(100);

  const tasks = targets.map((item) =>
    limit(async () =>
      LearningService.update({
        ...item,
        times: 1,
        lastTime: '20200101',
        nextTime: '20200101',
      })
    )
  );

  await Promise.all(tasks);
};

patch();
