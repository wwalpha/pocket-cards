import { Consts, Environment } from '@consts';
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
  })
    .filter((item) => item.subject !== Consts.SUBJECT.MATHS)
    .filter((item) => item.subject !== Consts.SUBJECT.ENGLISH);

  Commons.updateQuestion(questions);
};
