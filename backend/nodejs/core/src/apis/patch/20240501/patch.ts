import { Environment } from '@consts';
import { QuestionService } from '@services';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

const patch = async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
  });

  await removeUnused(results.Items);
};

const removeUnused = async (questions: Tables.TQuestions[]) => {
  // @ts-ignore
  const items = questions.filter((item) => item['tags'] === undefined);
  const total = items.length;

  for (;;) {
    const item = items.pop();

    // not found
    if (item === undefined) break;

    await QuestionService.update({
      ...item,
      // @ts-ignore
      tags: undefined,
      category: undefined,
      difficulty: undefined,
      source: undefined,
      original: undefined,
    });

    console.log(`English Count: ${items.length}/${total}`);
  }
};


export default patch;

// patch();
