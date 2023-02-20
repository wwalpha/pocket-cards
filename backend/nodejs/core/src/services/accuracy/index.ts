import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: Tables.TAccuracyKey): Promise<Tables.TAccuracy | undefined> => {
  const results = await DBHelper().get<Tables.TAccuracy>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TAccuracy): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TAccuracy): Promise<void> => {
  const curriculum = await describe({
    qid: item.qid,
    uid: item.uid,
  });

  // if exists
  if (!curriculum) {
    throw new Error(`Question not exists. ${item.qid}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 削除 */
export const remove = async (key: Tables.TAccuracyKey): Promise<void> => {
  await DBHelper().delete(Queries.del(key));
};

/** 一括削除 */
export const truncate = async (curriculums: Tables.TAccuracy[]): Promise<void> => {
  await DBHelper().truncate(Environment.TABLE_NAME_CURRICULUMS, curriculums);
};
