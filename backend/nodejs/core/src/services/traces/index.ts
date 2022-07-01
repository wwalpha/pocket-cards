import { Tables } from 'typings';
import { DBHelper } from '@utils';
import * as Queries from './queries';

export const dailyStatus = async (userId: string, datetime: string, groupId: string): Promise<Tables.TTraces[]> => {
  const results = await DBHelper().query<Tables.TTraces>(Queries.byUserId(userId, datetime, groupId));

  return results.Items;
};
