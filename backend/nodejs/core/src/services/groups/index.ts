import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (groupId: string): Promise<Tables.TGroups | undefined> => {
  const results = await DBHelper().get<Tables.TGroups>(
    Queries.get({
      id: groupId,
    })
  );

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TGroups): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TGroups): Promise<void> => {
  const groupInfo = await describe(item.id);

  // if exists
  if (!groupInfo) {
    throw new Error(`Group not exists. ${item.id}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** グループ削除 */
export const remove = async (id: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      id: id,
    })
  );
};

/** 科目別学年別のグループ一覧 */
export const listGroupByGrade = async (subject: string, grade: string): Promise<Tables.TGroups[]> => {
  const results = await DBHelper().query<Tables.TGroups>(Queries.byGrade(subject, grade));

  return results.Items;
};

/** グループの単語数カウント更新 */
export const minusCount = async (groupId: string, count: number) => {
  await DBHelper().update(minusCountQuery(groupId, count));
};

/** グループの単語数カウント更新 */
export const minusCountQuery = (groupId: string, count: number) => Queries.minusCount({ id: groupId }, count);

/** グループの単語数カウント更新 */
export const plusCount = async (groupId: string, count: number) => {
  await DBHelper().update(Queries.plusCount({ id: groupId }, count));
};
