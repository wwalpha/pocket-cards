import { Environment } from '@consts';
import { LearningService } from '@services';
import { DateUtils, DBHelper } from '@utils';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';

  const learnings = await LearningService.listByUser(userId);
  const now = DateUtils.getNow();

  const targets = learnings
    .filter((item) => item.subject_status !== undefined)
    .filter((item) => item.times > 0)
    .map((item) => {
      item.subject_status = undefined;
      return item;
    });

  // clear status
  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, targets);

  const tests = learnings
    .filter((item) => item.nextTime >= now)
    .map((item) => {
      item.subject_status = `${item.subject}_TEST`;
      return item;
    });

  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, tests);
};

patch();
