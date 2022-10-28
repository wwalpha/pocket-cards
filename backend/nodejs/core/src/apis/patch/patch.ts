import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TLearning>({
    TableName: Environment.TABLE_NAME_LEARNING,
  });

  const learnings = results.Items.filter((item) => item.times > 0).filter((item) => item.nextTime <= '20221028');

  const bulks = learnings.map((item) => {
    item.subject_status = `${item.subject}_TEST`;
    return item;
  });

  await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, bulks);
};
