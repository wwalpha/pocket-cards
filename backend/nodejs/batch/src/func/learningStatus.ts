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

  const tasks = students.map(async (stu) => {
    // 当日学習／テスト分のみ取得
    let dailyTested = await getUserTested(stu, yesterday, yesterday);

    // テストステータス全て削除する
    dailyTested = dailyTested.map((item) => {
      item.subject_status = undefined;
      return item;
    });

    dailyTested.forEach((item) => {
      // テスト対象かつ、テスト日当日より前の場合、テストフラグを追加
      if (item.times > 0 && item.nextTime <= current) {
        // set test flag
        item.subject_status = `${item.subject}_TEST`;
      }
    });

    // update database
    if (dailyTested.length > 0) {
      await DBHelper().bulk(Environments.TABLE_NAME_LEARNING, dailyTested);
    }

    const nextDaily = await getUserDaily(stu, current);

    nextDaily.forEach((item) => {
      // テスト対象かつ、テスト日当日より前の場合、テストフラグを追加
      if (item.times > 0) {
        // set test flag
        item.subject_status = `${item.subject}_TEST`;
      }
    });

    // update database
    if (nextDaily.length > 0) {
      await DBHelper().bulk(Environments.TABLE_NAME_LEARNING, nextDaily);
    }
  });

  // execute all
  await Promise.all(tasks);
};

const getUserTested = async (item: Tables.TUsers, nextTime: string, lastTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(
    Learning.query.byUserDailyTested(item.id, nextTime, lastTime)
  );

  return results.Items;
};

const getUserDaily = async (item: Tables.TUsers, nextTime: string): Promise<Tables.TLearning[]> => {
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.byUserDaily(item.id, nextTime));

  return results.Items;
};

const getStudents = async (): Promise<Tables.TUsers[]> => {
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
  });

  return results.Items.filter((item) => item.authority === Consts.Authority.STUDENT);
};
