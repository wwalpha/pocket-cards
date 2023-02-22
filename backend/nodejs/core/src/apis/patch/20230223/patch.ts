import { Environment } from '@consts';
import { TraceService } from '@services';
import { DBHelper } from '@utils';
import moment from 'moment';
import { Tables } from 'typings';

export default async () => {
  const results = await DBHelper().scan<Tables.TTraces>({
    TableName: Environment.TABLE_NAME_TRACES,
  });

  const tasks = results.Items.map((item) =>
    TraceService.regist(
      {
        qid: item.qid,
        groupId: item.groupId,
        lastTime: item.lastTime,
        subject: item.subject,
        timesAfter: item.timesAfter,
        timesBefore: item.timesBefore,
        userId: item.userId,
      },
      moment(item.timestamp, 'YYYYMMDDHHmmss').unix().toString()
    )
  );

  await Promise.all(tasks);
};
