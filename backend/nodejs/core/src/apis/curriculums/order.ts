import { Request } from 'express';
import { CurriculumService } from '@services';
import { ValidationError } from '@utils';
import { APIs } from 'typings';
import { isEmpty } from 'lodash';

export default async (
  req: Request<APIs.CurriculumOrderParams, any, APIs.CurriculumOrderRequest, any>
): Promise<APIs.CurriculumOrderResponse> => {
  const { curriculumId } = req.params;
  const { order } = req.body;

  if (isEmpty(order)) {
    throw new ValidationError(`Required parameter: Order`);
  }

  // describe info
  const curriculum = await CurriculumService.describe(curriculumId);

  if (!curriculum) {
    throw new ValidationError(`Curriculum[${curriculumId}] not found.`);
  }

  // set new order
  curriculum.order = Number(order);

  // execute
  await CurriculumService.update(curriculum);

  return curriculum;
};
