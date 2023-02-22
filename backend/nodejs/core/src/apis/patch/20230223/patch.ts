import { Environment } from '@consts';
import { TraceService } from '@services';
import { DBHelper } from '@utils';
import moment from 'moment';
import { padStart, random } from 'lodash';
import { Tables } from 'typings';

export default async () => {
  const results = await DBHelper().scan<Tables.TTraces>({
    TableName: Environment.TABLE_NAME_TRACES,
  });

  const hashset = new Set<string>();
  const newer = results.Items.map((item) => ({
    ...item,
    timestamp: `${moment(item.timestamp, 'YYYYMMDDHHmmss').unix()}${padStart(random(0, 999).toString(), 3)}`,
  }));

  newer.forEach((item) => {
    if (hashset.has(item.timestamp)) {
      item.timestamp = (Number(item.timestamp) + random(0, 999)).toString();
    } else {
      hashset.add(item.timestamp);
    }
  });

  hashset.clear();

  newer.forEach((item) => {
    if (hashset.has(item.timestamp)) {
      item.timestamp = (Number(item.timestamp) + random(0, 999)).toString();
    } else {
      hashset.add(item.timestamp);
    }
  });

  hashset.clear();

  newer.forEach((item) => {
    if (hashset.has(item.timestamp)) {
      item.timestamp = (Number(item.timestamp) + random(0, 999)).toString();
    } else {
      hashset.add(item.timestamp);
    }
  });

  const tasks = newer.map((item) =>
    TraceService.registStream(
      {
        qid: item.qid,
        groupId: item.groupId,
        lastTime: item.lastTime,
        subject: item.subject,
        timesAfter: item.timesAfter,
        timesBefore: item.timesBefore,
        userId: item.userId,
      },
      item.timestamp
    )
  );

  await Promise.all(tasks);
};
