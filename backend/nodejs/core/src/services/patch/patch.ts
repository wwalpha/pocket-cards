import { Consts, Environment } from '@consts';
import { Curriculums, Groups } from '@queries';
import { DateUtils, DBHelper } from '@utils';
import { generate } from 'short-uuid';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const tests = await DBHelper().scan<Tables.TWeeklyTest>({
    TableName: Environment.TABLE_NAME_WEEKLY_TEST,
  });

  const society = tests.Items.filter((item) => item.subjectQid.startsWith(Consts.SUBJECT.SOCIETY));
  const science = tests.Items.filter((item) => item.subjectQid.startsWith(Consts.SUBJECT.SCIENCE));

  console.log(society);
  console.log(science);

  if (society.length > 0) {
    const newGroup1 = await createNewGroup({
      count: society.length,
      subject: getAbilitySubject(Consts.SUBJECT.SOCIETY),
      name: `実力テスト_${DateUtils.getNow()}_${DateUtils.getTimestamp().substring(8)}`,
    });

    await createCurriculums({
      groupId: newGroup1.id,
      guardian: 'wwalpha80@gmail.com',
      subject: newGroup1.subject,
      userId: society[0]!.userId,
    });

    const societyRows = society.map<Tables.TWeeklyAbility>((item) => ({
      id: newGroup1.id,
      qid: item.subjectQid.split('_')[1] ?? '',
      subject: newGroup1.subject,
      times: 0,
      userId: society[0]!.userId,
    }));

    await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, societyRows);
  }

  if (science.length > 0) {
    const newGroup2 = await createNewGroup({
      count: science.length,
      subject: getAbilitySubject(Consts.SUBJECT.SCIENCE),
      name: `実力テスト_${DateUtils.getNow()}_${DateUtils.getTimestamp().substring(8)}`,
    });

    await createCurriculums({
      groupId: newGroup2.id,
      guardian: 'wwalpha80@gmail.com',
      subject: newGroup2.subject,
      userId: science[0]?.userId ?? 'dummy',
    });

    const scienceRows = science.map<Tables.TWeeklyAbility>((item) => ({
      id: newGroup2.id,
      qid: item.subjectQid.split('_')[1] ?? '',
      subject: newGroup2.subject,
      times: 0,
      userId: science[0]?.userId ?? '',
    }));

    await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, scienceRows);
  }
};

const getAbilitySubject = (subject: string) => {
  switch (subject) {
    case Consts.SUBJECT.ENGLISH:
      return Consts.SUBJECT.ABILITY_ENGLISH;
    case Consts.SUBJECT.LANGUAGE:
      return Consts.SUBJECT.ABILITY_LANGUAGE;
    case Consts.SUBJECT.SCIENCE:
      return Consts.SUBJECT.ABILITY_SCIENCE;
    case Consts.SUBJECT.SOCIETY:
      return Consts.SUBJECT.ABILITY_SOCIETY;
    default:
      return '';
  }
};

const createNewGroup = async (item: Omit<Tables.TGroups, 'id'>) => {
  const dataRow: Tables.TGroups = {
    id: generate(),
    ...item,
  };

  // データ更新
  await DBHelper().put(Groups.put(dataRow));

  return dataRow;
};

const createCurriculums = async (item: Omit<Tables.TCurriculums, 'id'>) => {
  const dataRow: Tables.TCurriculums = {
    id: generate(),
    ...item,
  };

  // データ登録
  await DBHelper().put(Curriculums.put(dataRow));

  return dataRow;
};
