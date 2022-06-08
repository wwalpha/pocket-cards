import { Request } from 'express';
import { Commons } from '@utils';
import { APIs } from 'typings';
import { countBy } from 'lodash';
import { Consts } from '@consts';
import { LearningService } from '@services';

export default async (
  req: Request<any, any, APIs.LearningOverallRequest, any>
): Promise<APIs.LearningOverallResponse> => {
  const userId = Commons.getUserId(req);

  // 問題一覧
  const results = await LearningService.listByUser(userId);

  const language = results.filter((item) => item.subject === Consts.SUBJECT.LANGUAGE);
  const science = results.filter((item) => item.subject === Consts.SUBJECT.SCIENCE);
  const society = results.filter((item) => item.subject === Consts.SUBJECT.SOCIETY);
  const maths = results.filter((item) => item.subject === Consts.SUBJECT.MATHS);

  return {
    language: countBy(language, (item) => {
      return item.lastTime === Consts.INITIAL_DATE ? -1 : item.times;
    }),
    science: countBy(science, (item) => {
      return item.lastTime === Consts.INITIAL_DATE ? -1 : item.times;
    }),
    society: countBy(society, (item) => {
      return item.lastTime === Consts.INITIAL_DATE ? -1 : item.times;
    }),
    maths: countBy(maths, (item) => {
      return item.lastTime === Consts.INITIAL_DATE ? -1 : item.times;
    }),
  };
};
