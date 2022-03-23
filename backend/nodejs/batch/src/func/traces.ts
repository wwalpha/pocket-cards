import moment from 'moment';
import * as _ from 'lodash';
import { Histories, Traces } from '@queries';
import { Consts, DBHelper, Environments } from '@utils';
import { Tables } from 'typings';

export default async () => {
  const results = await DBHelper().scan<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
  });

  // yesterday
  const timestamp = moment().format('YYYYMMDD');

  const tasks = results.Items.map(async (item) => {
    const traceResults = await DBHelper().query(Traces.query.byUserId(item.id, timestamp));
    const items = traceResults.Items;

    const japanese = getCount(items, Consts.SUBJECT.JAPANESE.toString());
    const science = getCount(items, Consts.SUBJECT.SCIENCE.toString());
    const society = getCount(items, Consts.SUBJECT.SOCIETY.toString());

    // データ登録
    await DBHelper().put(
      Histories.put({
        userId: item.id,
        timestamp: timestamp,
        japanese: japanese,
        science: science,
        society: society,
      })
    );
  });

  // execute all
  await Promise.all(tasks);
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
