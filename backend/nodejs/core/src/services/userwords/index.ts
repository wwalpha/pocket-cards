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
    uid: item.uid,
    word: item.word,
  });

  // if exists
  if (!userword) {
    throw new Error(`Word is not exists. ${item.uid},${item.word}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 単語新規作成 */
export const regist = async (item: Tables.TUserWords): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};
