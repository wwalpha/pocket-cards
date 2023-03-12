import { LearningService } from '@services';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';

  const learnings = await LearningService.listByUser(userId);

  const targets = learnings.filter((item) => item.subject === '1').filter((item) => item.times === 0);

  console.log(targets);

  // await Promise.all(
  //   targets.map((item) =>
  //     LearningService.update({
  //       ...item,
  //       times: 1,
  //     })
  //   )
  // );
};

patch();
