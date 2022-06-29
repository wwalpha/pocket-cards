import { Environment } from '@consts';
import { DBHelper, Commons } from '@utils';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
  });

  const questions = results.Items.map((item) => {
    item.voiceAnswer = undefined;
    item.voiceTitle = undefined;

    return item;
  });

  Commons.updateQuestion(questions);
  // 全件削除
  // await DBHelper().truncateAll(Environment.TABLE_NAME_WORD_IGNORE);

  // const datas = results.Items.map<Tables.TWordIgnore>((item) => ({
  //   id: Consts.Authority.ADMIN,
  //   word: item.word,
  // }));

  // 一括登録
  // await DBHelper().bulk(Environment.TABLE_NAME_WORD_IGNORE, datas);
};
