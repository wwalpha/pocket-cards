import { API, Commons, DBHelper, Logger } from '@utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 単語詳細取得 */
export const describe = async (id: string): Promise<Tables.TWordMaster> => {
  const results = await DBHelper().get<Tables.TWordMaster>(
    Queries.get({
      id: id,
    })
  );

  // is exist
  if (results?.Item !== undefined) {
    return results.Item;
  }

  // regist new word
  return await registNewword(id);
};

const registNewword = async (id: string): Promise<Tables.TWordMaster> => {
  const newword = Commons.getOriginal(id);

  const results = await Promise.all([
    API.getPronounce(newword),
    Commons.saveWithMP3(newword),
    API.getTranslate(newword, 'zh'),
    API.getTranslate(newword, 'ja'),
  ]);

  const record: Tables.TWordMaster = {
    id: id,
    original: newword,
    pronounce: results[0].pronounce,
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  // regist dictionary
  await DBHelper().put(Queries.put(record));

  Logger.info(`単語辞書の登録は完了しました. ${newword}`);

  return record;
};

// /** 単語新規登録 */
// export const regist = async (item: Tables.TWordMaster): Promise<void> => {
//   await DBHelper().put(Queries.put(item));
// };

/** 無視単語判断 */
export const isIgnore = async (key: Tables.TWordIgnoreKey): Promise<boolean> => {
  const results = await DBHelper().get<Tables.TWordIgnore>(Queries.getFromIgnore(key));

  return results !== undefined;
};
