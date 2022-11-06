// import { Request } from 'express';
// import { LearningService } from '@services';
// import { Logger, Commons, QueryUtils, ValidationError } from '@utils';
// import { APIs, Tables } from 'typings';

// /** 今日の復習 */
// export default async (req: Request<any, any, any, APIs.QuestionReviewQuery>): Promise<APIs.QuestionReviewResponse> => {
//   // ユーザID
//   const userId = Commons.getUserId(req);
//   const subject = req.query.subject;

//   // 科目選択されていない
//   if (!subject) {
//     throw new ValidationError('Please select subject.');
//   }

//   // 問題一覧
//   const results = await LearningService.dailyReview(userId, subject);

//   // 検索結果０件の場合
//   if (results.length === 0) {
//     return EmptyResponse();
//   }

//   return await getQuestions(results);
// };

// const EmptyResponse = (): APIs.QuestionReviewResponse => ({
//   count: 0,
//   questions: [],
// });

// const getQuestions = async (dataRows: Tables.TLearning[]): Promise<APIs.QuestionReviewResponse> => {
//   Logger.info(`Count: ${dataRows.length}`);

//   // 単語明細情報の取得
//   const details = await QueryUtils.getQuestionDetails(dataRows);

//   return {
//     count: details.length,
//     questions: details,
//   };
// };
