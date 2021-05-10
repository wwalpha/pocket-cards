import { DynamoDB } from 'aws-sdk';
import { DBHelper } from '@utils';
import { Words } from '@queries';
import { API, Table } from 'typings';

export default async (params: API.C004Params, input: API.C004Request): Promise<API.C004Response> => {
  const { groupId, word } = params;

  // 単語が同じ
  if (input.newWord === word) {
    return;
  }

  const itemList: DynamoDB.DocumentClient.TransactWriteItemList = [];

  // 既存情報検索
  const oldItem = await DBHelper().get(
    Words.get({
      id: word,
      groupId,
    })
  );

  const newItem = await DBHelper().get(
    Words.get({
      id: input.newWord,
      groupId,
    })
  );

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
        ...(oldItem.Item as Table.TWords),
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
