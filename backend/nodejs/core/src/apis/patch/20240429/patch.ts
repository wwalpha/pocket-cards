import { Environment } from '@consts';
import { QuestionService, WordMasterService } from '@services';
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
      ':subject': '0'
    }
  })

  const items = results.Items;
  const total = items.length;

  for(;;) {
    const item = items.pop();

    // not found
    if (item === undefined) break;

    const master = await WordMasterService.describe({
      id: item.title
    });

    await QuestionService.update({
      ...item,
      voiceTitle: master.mp3
    })

    console.log(`Count: ${items.length}/${total}`);
  }
};

export default patch;

// patch();
