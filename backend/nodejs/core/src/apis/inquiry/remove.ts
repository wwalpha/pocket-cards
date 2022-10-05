import { Request } from 'express';
import { InquiryService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.InquiryRemoveParameter, any, APIs.InquiryRemoveResquest, any>
): Promise<APIs.InquiryRemoveResponse> => {
  const { id } = req.params;

  // データ削除
  await InquiryService.remove(id);
};
