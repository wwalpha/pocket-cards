import { Environment } from '@consts';
import { Learning, Questions } from '@queries';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

const start = async () => {
  const groups = await DBHelper().scan<Tables.TGroups>({
    TableName: Environment.TABLE_NAME_GROUPS,
  });

  const questions = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
  });

  console.log('Question Count', questions.Count);

  // migrate data to learning
  let tasks = questions.Items.map((item) => {
    console.log('Group Id', item.groupId);
    // @ts-ignore
    const grpItem = groups.Items.find((grp) => grp.id === item['setId']);

    return DBHelper().put(
      Learning.put({
        qid: item.id,
        // userId: grpItem?.userId as string,
        groupId: item.groupId,
        lastTime: item.lastTime,
        subjectNextTime: `${grpItem?.subject}_${item.nextTime}`,
        // @ts-ignore
        times: item.times,
      })
    );
  });

  await Promise.all(tasks);

  tasks = questions.Items.map((item) =>
    DBHelper().put(
      Questions.put({
        ...item,
        // @ts-ignore
        groupId: item['setId'],
      })
    )
  );

  await Promise.all(tasks);

  // sleep(5000);

  // remove columns of questions
  tasks = questions.Items.map((item) => {
    return DBHelper().update({
      TableName: Environment.TABLE_NAME_QUESTIONS,
      Key: {
        id: item.id,
      } as Tables.TQuestionsKey,
      UpdateExpression: `remove #lastTime, #nextTime, #times, #setId`,
      ExpressionAttributeNames: {
        '#lastTime': 'lastTime',
        '#nextTime': 'nextTime',
        '#times': 'times',
        '#setId': 'setId',
      },
    });
  });
};

start();
