import { DynamoDB } from 'aws-sdk';
import { Request } from 'express';
import { defaultTo } from 'lodash';
import moment from 'moment';
import { Commons, DateUtils, DBHelper } from '@utils';
import { Words, Histories } from '@queries';
import { APIs, Tables } from 'typings';

export default async (req: Request<APIs.C004Params, any, APIs.C004Request, any>): Promise<APIs.C004Response> => {
  const input = req.body;
  const userId = Commons.getUserId(req);

  // 学習カード
  if (input.type === '1') {
    // 学習カード
    await study(req.params, input, userId);
  }

  // 単語更新
  if (input.type === '2') {
    await update(req.params, input);
  }
};

const study = async (params: APIs.C004Params, input: APIs.C004Request, userId: string): Promise<APIs.C004Response> => {
  const { groupId, word } = params;

  // 正解の場合
  const times = input.correct ? defaultTo(input.times, 0) + 1 : 0;
  const nextTime = input.correct ? DateUtils.getNextTime(times) : DateUtils.getNextTime(0);

  const result = await DBHelper().get<Tables.TWords>(
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
          lastTime: result?.Item?.lastTime,
        }),
      },
    ],
  });
};

const update = async (params: APIs.C004Params, input: APIs.C004Request): Promise<APIs.C004Response> => {
  const { groupId, word } = params;

  if (!input.newWord || !input.times) throw new Error('Parameters not correct');

  if (input.newWord === word) {
    // 単語が同じ
    return;
  }

  const itemList: DynamoDB.DocumentClient.TransactWriteItemList = [];

  // 既存情報検索
  const oldItem = await DBHelper().get<Tables.TWords>(
    Words.get({
      id: word,
      groupId,
    })
  );

  const newItem = await DBHelper().get<Tables.TWords>(
    Words.get({
      id: input.newWord,
      groupId,
    })
  );

  if (!oldItem?.Item || !newItem?.Item) {
    throw new Error(`Cannot find word. ${word} ${input.newWord}`);
  }

  // 既存単語あり
  if (newItem) {
    // 対象単語を削除するのみ
    itemList.push({
      Delete: Words.del({
        id: word,
        groupId,
      }),
    });
  } else {
    // 新単語追加
    itemList.push({
      Put: Words.put({
        ...oldItem?.Item,
        id: input.newWord,
      }),
    });

    // 旧単語削除
    itemList.push({
      Delete: Words.del({
        id: word,
        groupId,
      }),
    });
  }

  // 単語情報更新
  await DBHelper().transactWrite({ TransactItems: itemList });
};
