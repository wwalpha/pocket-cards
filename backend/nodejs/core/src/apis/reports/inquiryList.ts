import { Request } from 'express';
import { APIs } from 'typings';
import { InquiryService } from '@services';

export default async (_: Request<any, any, APIs.InquiryListResquest, any>): Promise<APIs.InquiryListResponse> => {
  // データ登録
  const items = await InquiryService.getAll();

  return {
    items,
  };
};
