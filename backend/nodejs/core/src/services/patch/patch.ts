import { Questions, Reports } from '@queries';
import { DBHelper } from '@utils';
import { Tables } from 'typings';
import { Consts, Environment } from '@consts';

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

  const histories = await DBHelper().scan<Tables.THistories>({ TableName: Environment.TABLE_NAME_HISTORIES });

  const historiesTask = histories.Items.map((item) =>
    DBHelper().put(
      Reports.put({
        userId: item.userId,
        typeDate: `${Consts.REPORT_TYPE.DAILY_PROGRESS}_${item.timestamp}`,
        japanese: item.japanese,
        science: item.science,
        society: item.society,
      })
    )
  );

  await Promise.all(historiesTask);
};
