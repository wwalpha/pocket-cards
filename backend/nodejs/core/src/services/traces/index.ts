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

/** 問題詳細取得 */
export const describe = async (key: Tables.TTracesKey): Promise<Tables.TTraces | undefined> => {
  const results = await DBHelper().get<Tables.TTraces>(Queries.get(key));

  return results?.Item;
};

/** 問題詳細更新 */
export const update = async (item: Tables.TTraces): Promise<void> => {
  const question = await describe({
    qid: item.qid,
    timestamp: item.timestamp,
  });

  // if exists
  if (!question) {
    throw new Error(`Trace is not exists. ${item.qid}`);
  }

  await DBHelper().put(Queries.put(item));
};

/** 学習任務一覧 */
export const listByQuestion = async (qid: string): Promise<Tables.TTraces[]> => {
  const results = await DBHelper().query<Tables.TTraces>(Queries.byQuestionId(qid));

  return results.Items;
};

/** 学習ステータス一覧 */
export const listDailyStatus = async (userId: string, date: string): Promise<Tables.TTraces[]> => {
  const results = await DBHelper().query<Tables.TTraces>(Queries.listDailyStatus(userId, date));

  return results.Items;
};
