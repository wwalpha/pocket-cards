import { Request } from 'express';
import { APIs } from 'typings';
import { GroupService, QuestionService, WordService } from '@services';
import { Consts } from '@consts';
import { ValidationError } from '@utils';

export default async (
  req: Request<APIs.QuestionDescribeParams, any, APIs.QuestionDescribeRequest, any>
): Promise<APIs.QuestionDescribeResponse> => {
  const { groupId, questionId } = req.params;

  // group information
  const groupInfo = await GroupService.describe(groupId);

  if (!groupInfo) {
    throw new ValidationError('Group informations not found.');
  }

  // 普通のグループではない
  if (!Consts.SUBJECT_NORMAL.includes(groupInfo.subject)) {
    throw new ValidationError('Unvaliable subject.');
  }

  const question = await QuestionService.describe(questionId);

  // not exists
  if (!question) {
    throw new ValidationError('Question not found.');
  }

  // 英語の場合、原型取得する
  if (groupInfo.subject === Consts.SUBJECT.ENGLISH) {
    const wordInfo = await WordService.describe(question.title);

    question.original = wordInfo.original;
  }

  return {
    question: question,
  };
};
