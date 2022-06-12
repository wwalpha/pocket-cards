import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 問題詳細取得 */
export const describe = async (qid: string): Promise<Tables.TQuestions | undefined> => {
  const results = await DBHelper().get<Tables.TQuestions>(
    Queries.get({
      id: qid,
    })
  );

  return results?.Item;
};

/** 問題新規作成 */
export const regist = async (item: Tables.TQuestions): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** 問題詳細更新 */
export const update = async (item: Tables.TQuestions): Promise<void> => {
  const groupInfo = await describe(item.id);

  // if exists
  if (!groupInfo) {
    throw new Error(`Question not exists. ${item.id}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 問題削除 */
export const remove = async (id: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      id: id,
    })
  );
};

/** 全件検索 */
export const listAll = async (): Promise<Tables.TQuestions[]> => {
  const results = await DBHelper().scan<Tables.TQuestions>({ TableName: Environment.TABLE_NAME_QUESTIONS });

  return results.Items;
};

/** グループの問題一覧取得 */
export const listByGroup = async (groupId: string): Promise<Tables.TQuestions[]> => {
  const results = await DBHelper().query<Tables.TQuestions>(Queries.byGroupId(groupId));

  return results.Items;
};
