import { Request } from 'express';
import { DBHelper } from '@utils';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (
  request: Request<any, any, APIs.GroupListRequest, APIs.GroupListQuery>
): Promise<APIs.GroupListResponse> => {
  const subject = request.query.subject;

  let items: Tables.TGroups[] = [];

  // has filter
  if (subject) {
    //
    // const results = await DBHelper().query<Tables.TGroups>(Groups.query.bySubject);
  } else {
    const results = await DBHelper().scan<Tables.TGroups>({
      TableName: Environment.TABLE_NAME_GROUPS,
    });

    items = results.Items;
  }

  // ０件
  if (items.length === 0) {
    return {
      count: 0,
      items: [],
    };
  }

  return {
    count: items.length,
    items,
  };
};
