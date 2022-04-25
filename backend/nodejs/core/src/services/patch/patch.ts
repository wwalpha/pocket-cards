import { Environment } from '@consts';
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
};
