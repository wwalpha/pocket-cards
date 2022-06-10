import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TWordIgnore>({
    TableName: Environment.TABLE_NAME_WORD_IGNORE,
  });

  // 全件削除
  await DBHelper().truncateAll(Environment.TABLE_NAME_WORD_IGNORE);

  const datas = results.Items.map<Tables.TWordIgnore>((item) => ({
    id: 'wwalpha@gmail.com',
    word: item.word,
  }));

  // 一括登録
  await DBHelper().bulk(Environment.TABLE_NAME_WORD_IGNORE, datas);
};
