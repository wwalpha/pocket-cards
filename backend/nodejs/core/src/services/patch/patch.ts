import { Environment } from '@consts';
import { Questions } from '@queries';
import { DBHelper } from '@utils';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const curriculums = await DBHelper().scan<Tables.TCurriculums>({
    TableName: Environment.TABLE_NAME_CURRICULUMS,
  });
  const groups = await DBHelper().scan<Tables.TGroups>({
    TableName: Environment.TABLE_NAME_GROUPS,
  });

  const newRecords = curriculums.Items.map<Tables.TCurriculums>((item) => ({
    ...item,
    subject: groups.Items.find((group) => group.id === item.groupId)?.subject || '',
  }));

  // reset all records
  await DBHelper().bulk(Environment.TABLE_NAME_CURRICULUMS, newRecords);

  const questions = await DBHelper().scan<Tables.TQuestions>({
    TableName: Environment.TABLE_NAME_QUESTIONS,
  });

  const tasks = questions.Items.map((item) => {
    DBHelper().put(
      Questions.put({
        ...item,
        subject: groups.Items.find((g) => g.id === item.groupId)?.subject || '',
      })
    );
  });

  await Promise.all(tasks);
};
