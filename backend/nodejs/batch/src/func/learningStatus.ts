import { Learning } from '@queries';
import { Consts, DateUtils, DBHelper, Environments } from '@utils';
import { Tables } from 'typings';

export default async () => {
  // now
  const date = DateUtils.getNow();
  // only student
  const students = await getStudents();

  const tasks = students.map(async (item) => {
    // daily tests
    const tests = await getDailyTests(item, date);

    const tasks = tests.map((item) =>
      DBHelper().put(
        Learning.put({
          ...item,
          subject_status: `${item.subject}_TEST`,
        })
      )
    );

    await Promise.all(tasks);
  });

  // execute all
  await Promise.all(tasks);
};

const getDailyTests = async (item: Tables.TUsers, date: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.byUserDaily(item.id, date));

  return results.Items;
};

const getStudents = async (): Promise<Tables.TUsers[]> => {
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
  });

  return results.Items.filter((item) => item.authority === Consts.Authority.STUDENT);
};
