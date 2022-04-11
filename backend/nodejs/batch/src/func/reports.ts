import moment from 'moment';
import * as _ from 'lodash';
import { Learning, Reports, Traces } from '@queries';
import { Consts, DBHelper, Environments } from '@utils';
import { Tables } from 'typings';

export default async () => {
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
  });

  // yesterday
  const timestamp = moment().add(-1, 'days').format('YYYYMMDD');
  // only student
  const targets = results.Items.filter((item) => item.authority === Consts.Authority.STUDENT);

  const tasks = targets.map(async (item) => {
    // daily progress report
    const daily = await getDailyReport(item, timestamp);
    // overall times report
    const overallTimes = await getOverallTimesReport(item);

    // commit
    await DBHelper().transactWrite({
      TransactItems: [{ Put: Reports.put(daily) }, { Put: Reports.put(overallTimes) }],
    });
  });

  // execute all
  await Promise.all(tasks);
};

const getDailyReport = async (item: Tables.TUsers, timestamp: string): Promise<Tables.TReports> => {
  const traceResults = await DBHelper().query<Tables.TTraces>(Traces.query.byUserId(item.id, `${timestamp}999999`));
  const items = traceResults.Items;

  const japanese = getCount(items, Consts.SUBJECT.JAPANESE.toString());
  const science = getCount(items, Consts.SUBJECT.SCIENCE.toString());
  const society = getCount(items, Consts.SUBJECT.SOCIETY.toString());

  return {
    userId: item.id,
    typeDate: `${Consts.REPORT_TYPE.DAILY_PROGRESS}_${timestamp}`,
    japanese: japanese,
    science: science,
    society: society,
  };
};

const getOverallTimesReport = async (item: Tables.TUsers): Promise<Tables.TReports> => {
  const results = await DBHelper().query<Tables.TLearning>(Learning.query.byUserId(item.id));

  const timesGrouped = _.groupBy(results.Items, (item) => item.times);

  const times = _.map<_.Dictionary<Tables.TLearning[]>, Tables.OverallTimesReport>(timesGrouped, (item) => {
    return {
      times: item[0].times,
      japanese: item.filter((k) => k.subject === Consts.SUBJECT.JAPANESE.toString()).length,
      science: item.filter((k) => k.subject === Consts.SUBJECT.SCIENCE.toString()).length,
      society: item.filter((k) => k.subject === Consts.SUBJECT.SOCIETY.toString()).length,
    };
  });

  return {
    userId: item.id,
    typeDate: Consts.REPORT_TYPE.OVERALL_TIMES,
    times: times,
  };
};

const getCount = (array: Tables.TTraces[], subject: string): number => {
  // group by qid
  const grouped = _.groupBy(
    array.filter((a) => a.subject === subject),
    (item) => item.qid
  );
  // max timestamp -> times after answer -> filter 0 times -> count
  return _.map(grouped, (item) => _.maxBy(item, 'timestamp')?.timesAfter).filter((item) => item !== 0).length;
};
