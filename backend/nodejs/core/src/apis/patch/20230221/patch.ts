import { LearningService } from '@services';

export default async () => {
  const learnings = (await LearningService.listAll()).filter((item) => item.times === 0);

  const tasks = learnings.map((item) =>
    LearningService.update({
      ...item,
      times: -1,
    })
  );

  await Promise.all(tasks);
};
