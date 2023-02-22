import { Environment } from '@consts';
import { ClientUtils, DateUtils } from '@utils';
import { Tables } from 'typings';

/** データ登録 */
export const regist = async (item: Tables.TTraces) => {
  const client = ClientUtils.timestreamWrite();

  // insert record
  await client
    .writeRecords({
      DatabaseName: Environment.TIMESTREAM_DATABASE,
      TableName: Environment.TIMESTREAM_TABLE_TRACES,
      Records: [
        {
          MeasureName: 'Qid',
          MeasureValue: item.qid,
        },
        {
          MeasureName: 'UserId',
          MeasureValue: item.userId,
        },
        {
          MeasureName: 'Subject',
          MeasureValue: item.subject,
        },
        {
          MeasureName: 'GroupId',
          MeasureValue: item.groupId,
        },
        {
          MeasureName: 'TimesBefore',
          MeasureValue: item.timesBefore?.toString(),
        },
        {
          MeasureName: 'TimesAfter',
          MeasureValue: item.timesAfter?.toString(),
        },
        {
          MeasureName: 'LastTime',
          MeasureValue: item.lastTime,
        },
      ],
      CommonAttributes: {
        Time: DateUtils.getTimestamp(),
        TimeUnit: 'SECONDS',
      },
    })
    .promise();
};

// TODO: NEED TO REMOVE
// export const dailyStatus = async (userId: string, datetime: string, groupId: string): Promise<Tables.TTraces[]> => {
//   const results = await DBHelper().query<Tables.TTraces>(Queries.byUserId(userId, datetime, groupId));

//   return results.Items;
// };
