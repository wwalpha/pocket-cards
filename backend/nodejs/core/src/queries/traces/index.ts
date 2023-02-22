// TODO: NEED TO REMOVE
// import { Environment } from '@consts';
// import { DateUtils } from '@utils';
// import { TimestreamWrite } from 'aws-sdk';
// import { Tables } from 'typings';

// const writeClient = new TimestreamWrite();

// /** データ登録 */
// export const put = async (item: Tables.TTraces) => {
//   // insert record
//   await writeClient
//     .writeRecords({
//       DatabaseName: Environment.TIMESTREAM_DATABASE,
//       TableName: Environment.TIMESTREAM_TABLE_TRACES,
//       Records: [
//         {
//           MeasureName: 'Qid',
//           MeasureValue: item.qid,
//         },
//         {
//           MeasureName: 'UserId',
//           MeasureValue: item.userId,
//         },
//         {
//           MeasureName: 'Subject',
//           MeasureValue: item.subject,
//         },
//         {
//           MeasureName: 'GroupId',
//           MeasureValue: item.groupId,
//         },
//         {
//           MeasureName: 'TimesBefore',
//           MeasureValue: item.timesBefore?.toString(),
//         },
//         {
//           MeasureName: 'TimesAfter',
//           MeasureValue: item.timesAfter?.toString(),
//         },
//         {
//           MeasureName: 'LastTime',
//           MeasureValue: item.lastTime,
//         },
//       ],
//       CommonAttributes: {
//         Time: DateUtils.getTimestamp(),
//         TimeUnit: 'SECONDS',
//       },
//     })
//     .promise();
// };
