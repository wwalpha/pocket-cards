import { Request } from 'express';
import { DBHelper } from '@utils';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (_: Request): Promise<APIs.GroupListResponse> => {
  // 検索結果
  const results = await DBHelper().scan<Tables.TGroups>({
    TableName: Environment.TABLE_NAME_GROUPS,
  });

  const items = results.Items;

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
