import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (id: string, qid: string): Promise<Tables.TWeeklyAbility | undefined> => {
  const results = await DBHelper().get<Tables.TWeeklyAbility>(Queries.get({ id, qid }));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TWeeklyAbility): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TWeeklyAbility): Promise<void> => {
  const groupInfo = await describe(item.id, item.qid);

  // if exists
  if (!groupInfo) {
    throw new Error(`Ability not exists. ${item.id}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 削除処理 */
export const remove = async (id: string, qid: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      id,
      qid,
    })
  );
};

export const listByKey = async (id: string): Promise<Tables.TWeeklyAbility[]> => {
  const results = await DBHelper().query<Tables.TWeeklyAbility>(Queries.byKey(id));

  return results.Items;
};
