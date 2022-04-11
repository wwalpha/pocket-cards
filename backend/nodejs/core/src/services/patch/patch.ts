import { Questions } from '@queries';
import { DBHelper } from '@utils';
import { Tables } from 'typings';
import { Environment } from '@consts';

export default async (): Promise<void> => {
  const groups = await DBHelper().scan<Tables.TGroups>({ TableName: Environment.TABLE_NAME_GROUPS });

  const tasks = groups.Items.map<Promise<Tables.TGroups>>(async (item) => {
    const questions = await DBHelper().query(Questions.query.byGroupId(item.id));

    return {
      ...item,
      count: questions.Items.length,
    };
  });

  const results = await Promise.all(tasks);

  // update all datas
  await DBHelper().bulk(Environment.TABLE_NAME_GROUPS, results);
};
