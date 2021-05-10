import moment from 'moment';
import { DateUtils, DBHelper } from '@utils';
import { Words, Histories } from '@queries';
import { API, Table } from 'typings';

export default async (params: API.C004Params, input: API.C004Request, userId: string): Promise<API.C004Response> => {
  const { groupId, word } = params;

  // 正解の場合
  const times = input.correct ? input.times + 1 : 0;
  const nextTime = input.correct ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  const result = await DBHelper().get(
    Words.get({
      id: word,
      groupId,
    })
  );

  // 単語学習情報更新 と 履歴追加
  await DBHelper().transactWrite({
    TransactItems: [
      {
        Update: Words.update.info({
          id: word,
          groupId: groupId,
          nextTime: nextTime,
          times: times,
          lastTime: DateUtils.getNow(),
        }),
      },
      {
        Put: Histories.put({
          user: userId,
          timestamp: moment().format('YYYYMMDDHHmmssSSS'),
          word: word,
          group: groupId,
          times: times,
          lastTime: (result.Item as Table.TWords)?.lastTime,
        }),
      },
    ],
  });
};
