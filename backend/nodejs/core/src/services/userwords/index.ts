import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 単語詳細取得 */
export const describe = async (key: Tables.TUserWordsKey): Promise<Tables.TUserWords | undefined> => {
  const results = await DBHelper().get<Tables.TUserWords>(Queries.get(key));

  return results?.Item;
};

/** 問題詳細更新 */
export const update = async (item: Tables.TUserWords): Promise<void> => {
  const userword = await describe({
    id: item.id,
    uid: item.uid,
  });

  // if exists
  if (!userword) {
    throw new Error(`Word is not exists. ${item.uid},${item.id}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 単語新規作成 */
export const regist = async (item: Tables.TUserWords): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 単語新規作成 */
export const remove = async (key: Tables.TUserWordsKey): Promise<void> => {
  await DBHelper().delete(Queries.del(key));
};

/** 単語詳細取得 */
export const removeCurriculumn = async (key: Tables.TUserWordsKey, curriculumId: string): Promise<void> => {
  const results = await DBHelper().get<Tables.TUserWords>(Queries.get(key));

  if (!results?.Item) return;

  const newItem = { ...results.Item };
  // remove curriculumn id
  newItem.curriculumns = newItem.curriculumns?.filter((item) => item !== curriculumId);

  if (newItem.curriculumns?.length === 0) {
    await remove(key);
  } else {
    await update(newItem);
  }
};

export const addCurriculumn = async (key: Tables.TUserWordsKey, curriculumId: string): Promise<void> => {
  const item = await describe(key);

  // if not exists
  if (!item) {
    // 新規登録
    await regist({
      ...key,
      curriculumns: [curriculumId],
    });

    return;
  }

  const newCurriculumns = item.curriculumns ?? [];

  if (newCurriculumns.length > 0) {
    item.curriculumns = [...newCurriculumns, curriculumId];
  }

  // 項目更新
  await update(item);
};
