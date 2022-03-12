import { Request } from 'express';
import { generate } from 'short-uuid';
import isEmpty from 'lodash/isEmpty';
import { Commons, DBHelper } from '@utils';
import { Groups, Learning, Questions } from '@queries';
import { APIs, Tables } from 'typings';

/** 問題カード一括追加 */
export default async (req: Request<APIs.QuestionRegistParams, any, APIs.QuestionRegistRequest, any>): Promise<void> => {
  const input = req.body;
  const groupId = req.params.groupId;
  const userId = Commons.getUserId(req);

  // ユーザのグループID 一覧
  const userGroups = await DBHelper().query<Tables.TGroups>(Groups.query.byUserId(userId));
  const groupInfo = userGroups.Items.find((item) => item.id === groupId && item.userId === userId);

  // group not users
  if (!groupInfo) {
    throw new Error(`Group id is not exist. ${groupId}`);
  }

  // regist
  const tasks = input.questions.map((item) => {
    const items = item.split(',');
    const qItem: Tables.TQuestions = {
      id: generate(),
      groupId: groupId,
      title: items[0],
      description: !isEmpty(items[1]) ? item[1] : undefined,
      choices: !isEmpty(items[2]) ? items[2].split('|') : undefined,
      answer: items[3],
    };

    const lItem: Tables.TLearning = {
      qid: qItem.id,
      groupId: groupId,
      userId: userId,
      subjectNextTime: `${groupInfo.subject}_19000101`,
      lastTime: '19000101',
      times: 0,
    };

    return DBHelper().transactWrite({
      TransactItems: [{ Put: Questions.put(qItem) }, { Put: Learning.put(lItem) }],
    });
  });

  await Promise.all(tasks);
};
