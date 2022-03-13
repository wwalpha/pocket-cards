import { Questions, WordMaster } from '@queries';
import { DBHelper, Logger } from '@utils';
import { APIs, Tables } from 'typings';

/** 単語明細情報の取得 */
export const getWordDetails = async (words: Tables.TWords[]) => {
  // 単語明細情報を取得する
  const tasks = words.map((item) => DBHelper().get<Tables.TWordMaster>(WordMaster.get(item.id)));
  const details = (await Promise.all(tasks))
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.info('検索結果', details);

  // 返却結果
  const rets: APIs.WordItem[] = [];

  words.forEach((t) => {
    const item = details.find((w) => w.id === t.id);

    // 明細情報存在しないデータを除外する
    if (!item) return;

    rets.push({
      id: item.id,
      groupId: t.groupId,
      mp3: item.mp3,
      pronounce: item.pronounce,
      vocChn: item.vocChn,
      vocJpn: item.vocJpn,
      times: t.times,
    } as APIs.WordItem);
  });

  return rets;
};

export const getQuestionDetails = async (ids: Tables.TLearningKey[]) => {
  // 単語明細情報を取得する
  const tasks = ids.map((item) =>
    DBHelper().get<Tables.TQuestions>(
      Questions.get({
        id: item.qid,
      })
    )
  );

  const details = (await Promise.all(tasks))
    .map((item) => item?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.info('検索結果', details);

  return details;
};
