import { Request } from 'express';
import { API, Commons, DateUtils, DBHelper, Logger } from '@utils';
import { WordMaster, Groups, Words, WordIgnore } from '@queries';
import { APIs, Tables } from 'typings';

/** グループ単語新規追加 */
export default async (req: Request<APIs.C001Params, any, APIs.C001Request, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const words = input.words.map((item) => item.toLowerCase());
  const userId = Commons.getUserId(req);

  // 既存単語マスタを検索する
  const tasks = words.map((item) => {
    const newword = Commons.getOriginal(item);

    // word register task
    return registWord(newword, groupId, userId);
  });

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
const registWord = async (word: string, groupId: string, userId: string) => {
  const ignoreResult = await DBHelper().get(WordIgnore.get({ id: userId, word: word }));

  // ignore word exist
  if (ignoreResult?.Item) {
    return;
  }

  // get dictionary
  const dict = await getDictionary(word);

  try {
    // word table update
    const input = Words.put({
      id: dict.id,
      display: dict.original,
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
  } catch (err) {}
};

const getDictionary = async (word: string): Promise<Tables.TWordMaster> => {
  const result = await DBHelper().get<Tables.TWordMaster>(WordMaster.get(word));

  if (!result || !result.Item) {
    return await addNewword(word);
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

const addNewword = async (word: string) => {
  const results = await Promise.all([
    API.getPronounce(word),
    Commons.saveWithMP3(word),
    API.getTranslate(word, 'zh'),
    API.getTranslate(word, 'ja'),
  ]);

  const record: Tables.TWordMaster = {
    id: word,
    original: word,
    pronounce: results[0].pronounce,
    mp3: results[1],
    vocChn: results[2],
    vocJpn: results[3],
  };

  // regist dictionary
  await DBHelper().put(WordMaster.put(record));

  Logger.info(`単語辞書の登録は完了しました. ${word}`);

  return record;
};
