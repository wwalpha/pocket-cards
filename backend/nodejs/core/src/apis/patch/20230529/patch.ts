import { Environment } from '@consts';
import { LearningService } from '@services';
import { DBHelper } from '@utils';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';
  const groupIds: string[] = ['prxVGZqu7DRxc5NbsdL4fe'];

  for (;;) {
    const groupId = groupIds.pop();

    if (!groupId) {
      break;
    }

    const learnings = await LearningService.listByUser(userId, groupId);

    const items = learnings
      .filter((item) => item.times < 3)
      .map((item) => ({
        ...item,
        times: 3,
      }));

    await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, items);
  }
};

patch();
