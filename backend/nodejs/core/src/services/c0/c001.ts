import { Request } from 'express';
import { API, Commons, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Groups, Words, WordIgnore } from '@queries';
import { APIs, Tables } from 'typings';

/** グループ単語新規追加 */
export default async (req: Request<APIs.C001Params, any, APIs.C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const words = input.words.map((item) => item.toLowerCase().trim());
  const userId = Commons.getUserId(req);

  // 既存単語マスタを検索する
  const tasks = words.map((item) => registWord(item, groupId, userId));

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
const registWord = async (id: string, groupId: string, userId: string) => {
  // get dictionary
  const dict = await getDictionary(id);

  const ignoreResult = await DBHelper().get(WordIgnore.get({ id: userId, word: dict.id }));

  // ignore word exist
  if (ignoreResult?.Item) {
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

    // groug table update
    const update = Groups.update.addCount(groupId, userId, 1);

    // execute
    await DBHelper().transactWrite({
      TransactItems: [
        { Put: input },
        {
          Update: {
            TableName: update.TableName,
            Key: update.Key,
            UpdateExpression: update.UpdateExpression as string,
            ExpressionAttributeNames: update.ExpressionAttributeNames,
            ExpressionAttributeValues: update.ExpressionAttributeValues,
          },
        },
      ],
    });
  } catch (err) {
    if ((err as any).code !== 'ConditionalCheckFailedException') {
      console.log(err);
    }
  }
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
