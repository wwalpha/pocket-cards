import moment from 'moment';
import { Learning } from '@queries';
import { Consts, DateUtils, DBHelper, Environments } from '@utils';
import { Tables } from 'typings';

export default async () => {
  // now
  const current = DateUtils.getNow();
  const yesterday = moment().add(-1, 'days').format('YYYYMMDD');

  // only student
  const students = await getStudents();

  console.log(JSON.stringify(students));

  const tasks = students.map(async (item) => {
    // daily tests
    const daily = await getUserDaily(item, current);

    console.log(JSON.stringify(daily));

    const tests = daily
      .filter((item) => item.times !== 0)
      .map((item) => {
        // add test flag
        item.subject_status = `${item.subject}_TEST`;

        return item;
      });

    // update database
    await DBHelper().bulk(Environments.TABLE_NAME_LEARNING, tests);

    // daily tests
    const previous = await getUserDaily(item, yesterday);

    console.log(JSON.stringify(previous));

    const studies = previous
      .filter((item) => item.times === 0)
      .map((item) => {
        // add test flag
        item.subject_status = undefined;

        return item;
      });

    // update database
    await DBHelper().bulk(Environments.TABLE_NAME_LEARNING, studies);
  });

  // execute all
  await Promise.all(tasks);
};

const getUserDaily = async (item: Tables.TUsers, date: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.byUserDaily(item.id, date));

  return results.Items;
};

const getStudents = async (): Promise<Tables.TUsers[]> => {
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
  });

  return results.Items.filter((item) => item.authority === Consts.Authority.STUDENT);
};
