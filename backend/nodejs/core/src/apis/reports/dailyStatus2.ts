// import { Request } from 'express';
// import { APIs } from 'typings';
// import { QuestionService, TraceService } from '@services';

// export default async (
//   req: Request<any, any, APIs.DailyStatusResquest, APIs.DailyStatusQuery>
// ): Promise<APIs.DailyStatusResponse> => {
//   const { datetime, userId, groupId } = req.query;

//   // 日次学習進捗
//   const traces = await TraceService.dailyStatus(userId, datetime, groupId);

//   const tasks = traces.map<Promise<APIs.DailyStatusResponseItem | undefined>>(async (item) => {
//     const question = await QuestionService.describe(item.qid);

//     if (!question) return undefined;

//     return {
//       qid: item.qid,
//       title: question.title,
//       before: item.timesBefore ?? 0,
//       after: item.timesAfter ?? 0,
//     };
//   });

//   const results = await Promise.all(tasks);

//   return {
//     items: results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
//   };
// };
