import { Request } from 'express';
import { DBHelper, Commons, DateUtils } from '@utils';
import { Groups, Questions } from '@queries';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { generate } from 'short-uuid';

/** 週テスト対策問題登録 */
export default async (
  req: Request<any, any, APIs.WeeklyAbilityRegistRequest, any>
): Promise<APIs.WeeklyAbilityRegistResponse> => {
  // next study date
  const { groupIds } = req.body;
  const userId = Commons.getUserId(req);

  if (!groupIds || groupIds.length === 0) {
    throw new Error('Group ids is required.');
  }

  // get all group infomations
  const tasks = groupIds.map(async (item) => DBHelper().get<Tables.TGroups>(Groups.get({ id: item })));

  const groupResults = await Promise.all(tasks);
  const groups = groupResults
    .map((group) => group?.Item)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  const normalCount = groups.filter((item) => Consts.SUBJECT_NORMAL.includes(item.subject)).length;

  // validation
  if (groups.length === 0) {
    throw new Error('Group information is not found.');
  }

  // validation
  if (groups.length !== normalCount) {
    throw new Error('Base group can not use ability group.');
  }

  const subject = groups[0]!.subject;
  const qTasks = groups.map((item) => DBHelper().query<Tables.TQuestions>(Questions.query.byGroupId(item.id)));
  const qResults = await Promise.all(qTasks);
  const questions: Tables.TQuestions[] = [];

  qResults.forEach((items) => {
    items.Items.forEach((item) => questions.push(item));
  });

  const newGroup = await createNewGroup({
    count: questions.length,
    subject: getAbilitySubject(subject),
    name: `実力テスト_${DateUtils.getNow()}_${DateUtils.getTimestamp().substring(8)}`,
  });

  const dataRows = questions.map<Tables.TWeeklyAbility>((item) => ({
    id: newGroup.id,
    qid: item.id,
    subject: newGroup.subject,
    userId: userId,
    times: 0,
  }));

  // bulk insert
  await DBHelper().bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, dataRows);

  return {
    groupId: newGroup.id,
  };
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
