import { Request } from 'express';
import { DBHelper, Commons } from '@utils';
import { Groups, WordIgnore, Words } from '@queries';
import { APIs, Tables } from 'typings';
import { isEmpty } from 'lodash';

export default async (req: Request<any, any, APIs.D003Request, any>): Promise<APIs.D003Response> => {
  const userId = Commons.getUserId(req);
  const { word } = req.body;

  // validation
  if (isEmpty(word)) return;

  // regist ignore word
  await DBHelper().put(WordIgnore.put({ id: userId, word: word }));

  // query groups from user
  const results = await DBHelper().query<Tables.TGroups>(Groups.query.byUserId(userId));

  // remove word from all groups
  const tasks = results.Items.map(async (item) => {
    try {
      // delete word from group
      await DBHelper().delete(Words.del({ groupId: item.id, id: word }));
    } catch (err) {}
  });

  // execute tasks
  await Promise.all(tasks);
};
