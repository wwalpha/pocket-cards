import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (curriculumId: string): Promise<Tables.TCurriculums | undefined> => {
  const results = await DBHelper().get<Tables.TCurriculums>(
    Queries.get({
      id: curriculumId,
    })
  );

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TCurriculums): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TCurriculums): Promise<void> => {
  const curriculum = await describe(item.id);

  // if exists
  if (!curriculum) {
    throw new Error(`Curriculum not exists. ${item.id}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** カリキュラム削除 */
export const remove = async (id: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      id: id,
    })
  );
};

/** 保護者関連のカリキュラム一覧 */
export const getListByGuardian = async (guardian: string, subject?: string): Promise<Tables.TCurriculums[]> => {
  const results = await DBHelper().query<Tables.TCurriculums>(Queries.byGuardian(guardian));

  // filter
  if (subject) {
    return results.Items.filter((item) => item.subject === subject);
  }

  return results.Items;
};

/** グループ関連のカリキュラム一覧 */
export const getListByGroup = async (groupId: string, userId?: string): Promise<Tables.TCurriculums[]> => {
  const results = await DBHelper().query<Tables.TCurriculums>(Queries.byGroupId(groupId, userId));

  return results.Items;
};

/** 未学習のカリキュラム一覧を取得 */
export const getUnlearned = async (
  guardian: string,
  userId: string,
  subject: string
): Promise<Tables.TCurriculums[]> => {
  const results = await DBHelper().query<Tables.TCurriculums>(Queries.byUnlearned(guardian, userId, subject));

  return results.Items;
};

/** 未学習数を更新する */
export const updateUnlearned = async (id: string, count: number) => {
  await DBHelper().update(
    Queries.updateUnlearned(
      {
        id: id,
      },
      count
    )
  );
};
