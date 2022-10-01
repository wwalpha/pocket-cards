import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** データ取得する */
export const describe = async (qid: string): Promise<Tables.TInquiry | undefined> => {
  const results = await DBHelper().get<Tables.TInquiry>(Queries.get({ qid }));

  return results?.Item;
};

/** データ登録 */
export const regist = async (item: Tables.TInquiry): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

/** データ更新 */
export const update = async (item: Tables.TInquiry): Promise<void> => {
  const info = await describe(item.qid);

  // if exists
  if (!info) {
    throw new Error(`Data not found. ${item.qid}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** データ更新 */
export const getAll = async (): Promise<Tables.TInquiry[]> => {
  const results = await DBHelper().scan<Tables.TInquiry>({
    TableName: Environment.TABLE_NAME_INQUIRY,
  });

  return results.Items;
};

/** データ削除 */
export const remove = async (qid: string): Promise<void> => {
  await DBHelper().delete(
    Queries.del({
      qid,
    })
  );
};
