import { ApolloCache } from 'apollo-cache';
import { UpdatePathVariables, StatusInfo } from 'typings/graphql';
import { readStatus, GQL_STATUS_INFO } from '@gql/local';

/** パス情報更新 */
export default (_: any, { path }: UpdatePathVariables, context: any) => {
  const cache = context.cache as ApolloCache<any>;

  const statusInfo = readStatus(cache);
  statusInfo.status.path = path;

  // Cache更新
  cache.writeQuery<StatusInfo>({
    query: GQL_STATUS_INFO,
    data: statusInfo,
  });

  console.log('UpdatePath Resolver', statusInfo.status);
  return statusInfo.status;
};
