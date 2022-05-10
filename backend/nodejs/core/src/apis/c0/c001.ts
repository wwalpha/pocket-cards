import { Request } from 'express';
import { API, Commons, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Words, WordIgnore } from '@queries';
import { APIs, Tables } from 'typings';
import { GroupService } from '@services';

/** グループ単語新規追加 */
export default async (req: Request<APIs.C001Params, any, APIs.C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const words = input.words.map((item) => item.toLowerCase().trim());
  const userId = Commons.getUserId(req);

  // ユーザのグループID 一覧
  const userGroups = await GroupService.listGroupsByUserId(userId);
  const groupIds = userGroups.map((item) => item.id);

  // 既存単語マスタを検索する
  const tasks = words.map((item) => registWord(item, groupId, userId, groupIds));

  // regist
  await Promise.all(tasks);
};

/**
 * Regist word to group
 *
 * @param word regist word
 * @param groupId word group
 * @param userId user id
 * @returns void
 */
const registWord = async (id: string, groupId: string, userId: string, userGroups: string[]) => {
  // get dictionary
  const dict = await getDictionary(id);

  const ignoreResult = await DBHelper().get(WordIgnore.get({ id: userId, word: dict.id }));

  // ignore word exist
  if (ignoreResult?.Item) {
    return;
  }

  const exists = await isExist(dict.id, userGroups);

  // 単語は他のグループにすでに存在する
  if (exists) {
    return;
  }

  try {
    // word table update
    const input = Words.put({
      id: dict.id,
      groupId: groupId,
      nextTime: DateUtils.getNow(),
      times: 0,
      vocabulary: dict.vocJpn,
    });

    input.ConditionExpression = 'attribute_not_exists(id)';

    // add word
    await DBHelper().put(input);

    // count plus one
    await GroupService.plusCount(groupId, 1);
  } catch (err) {
    if ((err as any).code !== 'ConditionalCheckFailedException') {
      console.log(err);
    }
  }
};

const isExist = async (word: string, userGroups: string[]) => {
  const tasks = userGroups.map((item) =>
    DBHelper().get(
      Words.get({
        id: word,
        groupId: item,
      })
    )
  );

  const results = await Promise.all(tasks);

  const sum = results
    .map<number>((item) => (item?.Item === undefined ? 0 : 1))
    .reduce((prev, curr) => {
      return prev + curr;
    });

  return sum > 0;
};

/**
 * Get word informations from master table
 *
 * @param id
 * @returns
 */
const getDictionary = async (id: string): Promise<Tables.TWordMaster> => {
  const result = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(id));

  if (!result || !result.Item) {
    return await addNewword(id);
    // return {
    //   id: id,
    //   original: id,
    // };
  }

  const item = result.Item;

  // same word or multi words
  if (item.id === item.original || Commons.getOriginal(item.id) === item.original) {
    return item;
  }

  const original = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(item.original));

  if (!original || !original.Item) {
    throw new Error(`Dictionary is not exist. ${item.original}`);
  }

  return original.Item;
};

/**
 * Add new word to master table
 *
 * @param id word
 * @returns
 */
const addNewword = async (id: string) => {
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
  await DBHelper().put(WordMaster.put(record));

  Logger.info(`単語辞書の登録は完了しました. ${newword}`);

  return record;
};
