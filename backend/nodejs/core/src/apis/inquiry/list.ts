import { Request } from 'express';
import { APIs } from 'typings';
import { InquiryService, QuestionService } from '@services';

export default async (_: Request<any, any, APIs.InquiryListResquest, any>): Promise<APIs.InquiryListResponse> => {
  // データ登録
  const items = await InquiryService.getAll();

  // 問題一覧
  const questions = await Promise.all(items.map((item) => QuestionService.describe(item.qid)));

  return {
    items: questions.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  };
};
