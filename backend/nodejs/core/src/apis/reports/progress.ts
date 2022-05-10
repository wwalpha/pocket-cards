import { Request } from 'express';
import { Commons } from '@utils';
import { APIs } from 'typings';
import * as _ from 'lodash';
import { ReportService } from '@services';

export default async (
  req: Request<any, any, APIs.LearningProgressRequest, any>
): Promise<APIs.LearningProgressResponse> => {
  const userId = Commons.getUserId(req);

  // 問題一覧
  const results = await ReportService.dailyProgress(userId);

  const items = _.orderBy(results, ['typeDate', 'asc']);

  return {
    histories: items.map((item) => ({
      timestamp: item.typeDate.split('_')[2] as string,
      japanese: item.japanese,
      science: item.science,
      society: item.society,
    })),
  };
};
