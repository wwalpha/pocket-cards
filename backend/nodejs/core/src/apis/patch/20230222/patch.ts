import { LearningService } from '@services';

export default async () => {
  const learnings = (await LearningService.listAll())
    .filter((item) => item.times === 8)
    .filter((item) => item.lastTime === '20221222');

  const tasks = learnings.map((item) =>
    LearningService.update({
      ...item,
      times: 6,
    })
  );

  await Promise.all(tasks);
};
