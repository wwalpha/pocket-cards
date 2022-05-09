import { Request } from 'express';
import { isEmpty } from 'lodash';
import { DBHelper, Commons } from '@utils';
import { WordIgnore, Words } from '@queries';
import { APIs } from 'typings';
import { GroupService } from '@services';

export default async (req: Request<any, any, APIs.D003Request, any>): Promise<APIs.D003Response> => {
  const userId = Commons.getUserId(req);
  const { word } = req.body;

  // validation
  if (isEmpty(word)) return;

  // regist ignore word
  await DBHelper().put(WordIgnore.put({ id: userId, word: word }));

  // query groups from user
  const results = await GroupService.listGroupsByUserId(userId);

  // remove word from all groups
  const tasks = results.map(async (item) => {
    try {
      const result = await DBHelper().get(Words.get({ groupId: item.id, id: word }));

      // validation
      if (!result?.Item) {
        return;
      }

      await DBHelper().transactWrite({
        TransactItems: [
          {
            Delete: Words.del({ groupId: item.id, id: word }),
          },
          {
            Update: GroupService.minusCountQuery(item.id, 1),
          },
        ],
      });
    } catch (err) {
      console.log(item.id, word);
      console.log(err);
    }
  });

  // execute tasks
  await Promise.all(tasks);
};
