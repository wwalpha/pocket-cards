import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** レポート詳細取得 */
export const describe = async (userId: string, typeDate: string): Promise<Tables.TReports | undefined> => {
  const results = await DBHelper().get<Tables.TReports>(
    Queries.get({
      userId: userId,
      typeDate: typeDate,
    })
  );

  return results?.Item;
};

/** レポート新規作成 */
export const regist = async (item: Tables.TReports): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 日次進捗 */
export const dailyProgress = async (userId: string): Promise<Tables.TReports[]> => {
  const results = await DBHelper().query<Tables.TReports>(Queries.byDailyProgress(userId));

  return results.Items;
};
