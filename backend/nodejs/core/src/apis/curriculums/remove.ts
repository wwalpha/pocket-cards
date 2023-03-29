import { Request } from 'express';
import { CurriculumService, LearningService, QuestionService, UserWordService } from '@services';
import { DBHelper } from '@utils';
import { Consts, Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (
  req: Request<APIs.CurriculumRemoveParams, any, APIs.CurriculumRemoveRequest, any>
): Promise<APIs.CurriculumRemoveResponse> => {
  const curriculumId = req.params.curriculumId;

  // describe info
  const curriculum = await CurriculumService.describe(curriculumId);

  if (!curriculum) {
    throw new Error(`Curriculum[${curriculumId}] not found.`);
  }

  // group id
  const { groupId, userId } = curriculum;

  // get all learning datas
  const learning = await LearningService.listByGroup(groupId, userId);

  // execute all
  await Promise.all([
    // remove all learning records
    DBHelper().truncate(Environment.TABLE_NAME_LEARNING, learning),
    // remove curriculum
    CurriculumService.remove(curriculumId),
  ]);

  // 英語の場合、単語の学習一覧に登録
  if (curriculum.subject === Consts.SUBJECT.ENGLISH) {
    await removeUserWords(curriculum, learning);
  }
};

const removeUserWords = async (curriculum: Tables.TCurriculums, learning: Tables.TLearning[]) => {
  // get word list
  const questions = await Promise.all(learning.map((item) => QuestionService.describe(item.qid)));
  // remove undefined
  const words = questions
    .map((item) => item?.title)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // remove curriculumn
  await Promise.all(
    words.map((item) => UserWordService.removeCurriculumn({ id: item, uid: curriculum.userId }, curriculum.id))
  );
};
