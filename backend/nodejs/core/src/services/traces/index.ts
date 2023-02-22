import { Environment } from '@consts';
import { ClientUtils, DateUtils, DBHelper } from '@utils';
import * as Queries from './queries';
import { Tables } from 'typings';

/** データ登録 */
export const registStream = async (item: Tables.TTraces, timestamp?: string) => {
  const client = ClientUtils.timestreamWrite();

  const request = client.writeRecords({
    DatabaseName: Environment.TIMESTREAM_DATABASE,
    TableName: Environment.TIMESTREAM_TABLE_TRACES,
    Records: [
      {
        MeasureName: 'Qid',
        MeasureValue: item.qid,
        MeasureValueType: 'VARCHAR',
      },
      {
        MeasureName: 'UserId',
        MeasureValue: item.userId,
        MeasureValueType: 'VARCHAR',
      },
      {
        MeasureName: 'Subject',
        MeasureValue: item.subject,
        MeasureValueType: 'VARCHAR',
      },
      {
        MeasureName: 'GroupId',
        MeasureValue: item.groupId,
        MeasureValueType: 'VARCHAR',
      },
      {
        MeasureName: 'TimesBefore',
        MeasureValue: item.timesBefore?.toString(),
        MeasureValueType: 'BIGINT',
      },
      {
        MeasureName: 'TimesAfter',
        MeasureValue: item.timesAfter?.toString(),
        MeasureValueType: 'BIGINT',
      },
      {
        MeasureName: 'LastTime',
        MeasureValue: item.lastTime,
        MeasureValueType: 'VARCHAR',
      },
    ],
    CommonAttributes: {
      Time: timestamp ? timestamp : DateUtils.getUnixTime(),
      TimeUnit: 'SECONDS',
      Dimensions: [
        {
          Name: 'Region',
          Value: Environment.AWS_DEFAULT_REGION,
        },
      ],
    },
  });

  await request.then(
    () => {},
    (err) => {
      console.log('Error writing records:', err);
      if (err.code === 'RejectedRecordsException') {
        printRejectedRecordsException(request);
      }
    }
  );
};

const printRejectedRecordsException = (request: any) => {
  const responsePayload = JSON.parse(request.response.httpResponse.body.toString());
  console.log('RejectedRecords: ', responsePayload.RejectedRecords);
};

/** 内容更新 */
export const regist = async (item: Tables.TTraces): Promise<void> => {
  await DBHelper().put(Queries.put(item));
};

// registStream({
//   qid: 'rnpttwZau3dK1bfv4hwULb',
//   timestamp: '20221107183139',
//   groupId: 'wXtkuF2vzjHPsohPoyuxRg',
//   lastTime: '20221017',
//   subject: '3',
//   timesAfter: 0,
//   timesBefore: 1,
//   userId: 'Google_109439805128280065775',
// });
