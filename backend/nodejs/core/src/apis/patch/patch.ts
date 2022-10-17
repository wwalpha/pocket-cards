import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TLearning>({
    TableName: Environment.TABLE_NAME_LEARNING,
  });

  const learnings = results.Items.filter((item) => item.userId === 'Google_109439805128280065775')
    .filter((item) => item.times === 8)
    .filter((item) => item.nextTime === '99991231');

  const bulks = learnings.map((item) => {
    item.nextTime = '20221222';
    return item;
  });

  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, bulks);
};
