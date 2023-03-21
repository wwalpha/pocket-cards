import { SES } from '@aws-sdk/client-ses';
import moment from 'moment';
import { Learning } from '@queries';
import { DBHelper, Environments, Consts } from '@utils';
import { Tables } from 'typings';

const client = new SES({});

export default async () => {
  // get teachers
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
    FilterExpression: 'attribute_exists(teacher)',
  });

  const teachers = results.Items;

  const tasks = teachers.map(async (item) => {
    const datas = await getStudentProgress(item.id);

    await sendmail(datas, item.username, item.teacher as string);
  });

  await Promise.all(tasks);
};

const getStudentProgress = async (userId: string): Promise<Tables.TLearning[][]> => {
  const results = await Promise.all([
    DBHelper().query<Tables.TLearning>(Learning.query.byUserTests(userId, moment().add(0, 'days').format('YYYYMMDD'))),
    DBHelper().query<Tables.TLearning>(Learning.query.byUserTests(userId, moment().add(1, 'days').format('YYYYMMDD'))),
    DBHelper().query<Tables.TLearning>(Learning.query.byUserTests(userId, moment().add(2, 'days').format('YYYYMMDD'))),
  ]);

  return results.map((item) => item.Items);
};

const sendmail = async (datas: Tables.TLearning[][], username: string, email: string) => {
  await client.sendEmail({
    Source: Environments.MASTER_EMAIL_ADDRESS,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: '【勉強にゃん】の週間予定',
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: getMessageBody(datas, username),
        },
      },
    },
  });
};

const getMessageBody = (datas: Tables.TLearning[][], username: string): string => {
  const message = `
★★${username}さんの３日間の予定表★★

${moment().add(0, 'days').format('YYYY/MM/DD')}: 国語: ${getJapaneseCount(datas[0])}  社会: ${getSocietyCount(
    datas[0]
  )}  理科: ${getScienceCount(datas[0])}
${moment().add(1, 'days').format('YYYY/MM/DD')}: 国語: ${getJapaneseCount(datas[1])}  社会: ${getSocietyCount(
    datas[1]
  )}  理科: ${getScienceCount(datas[1])}
${moment().add(2, 'days').format('YYYY/MM/DD')}: 国語: ${getJapaneseCount(datas[2])}  社会: ${getSocietyCount(
    datas[2]
  )}  理科: ${getScienceCount(datas[2])}`;

  return message;
};

const getJapaneseCount = (datas: Tables.TLearning[]): number =>
  datas.filter((item) => item.subject === Consts.SUBJECT.JAPANESE.toString()).length;

const getSocietyCount = (datas: Tables.TLearning[]): number =>
  datas.filter((item) => item.subject === Consts.SUBJECT.SOCIETY.toString()).length;

const getScienceCount = (datas: Tables.TLearning[]): number =>
  datas.filter((item) => item.subject === Consts.SUBJECT.SCIENCE.toString()).length;
