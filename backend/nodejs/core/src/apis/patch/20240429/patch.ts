import { Environment } from '@consts';
import { QuestionService } from '@services';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

const patch = async (): Promise<void> => {
  const results = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
    FilterExpression: '#subject = :subject',
    ExpressionAttributeNames: {
      '#subject': 'subject',
    },
    ExpressionAttributeValues: {
      ':subject': '0',
    },
  });

  const items = results.Items;
  const total = items.length;

  for (;;) {
    const item = items.pop();

    // not found
    if (item === undefined) break;

    await QuestionService.update(item);

    console.log(`Count: ${items.length}/${total}`);
  }
};

export default patch;

// patch();
