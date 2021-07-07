import { DynamoDB } from 'aws-sdk';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { APIs, Tables } from 'typings';

export default async (params: APIs.C004Params, input: APIs.C004Request): Promise<APIs.C004Response> => {
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
