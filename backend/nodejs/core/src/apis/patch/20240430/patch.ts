import { Consts, Environment } from '@consts';
import { QuestionService } from '@services';
import { Commons, DBHelper } from '@utils';
import { Tables } from 'typings';

const patch = async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
  });

  await fixEnglish(results.Items);

  await fixScienceAndSociety(results.Items);
};

const fixEnglish = async (questions: Tables.TQuestions[]) => {
  const items = questions.filter((item) => item.subject === Consts.SUBJECT.ENGLISH);
  const total = items.length;

  for (;;) {
    const item = items.pop();

    // not found
    if (item === undefined) break;

    const bucketKey = await Commons.saveWithMP3(item.title);

    await QuestionService.update({
      ...item,
      voiceTitle: bucketKey,
    });

    console.log(`English Count: ${items.length}/${total}`);
  }
};

const fixScienceAndSociety = async (questions: Tables.TQuestions[]) => {
  const items = questions.filter(
    (item) =>
      item.subject === Consts.SUBJECT.SCIENCE ||
      item.subject === Consts.SUBJECT.SOCIETY ||
      item.subject === Consts.SUBJECT.LANGUAGE
  );

  // recreate voices
  await Commons.updateQuestion(items, true);
};

export default patch;

// patch();
