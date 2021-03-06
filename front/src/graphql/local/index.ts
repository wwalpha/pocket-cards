export * from './mutations';
export * from './queries';
export * from './utils';

import { createLinkWithCache } from 'aws-appsync';
import { withClientState } from 'apollo-link-state';
import { resolvers } from './resolvers';
import { DocumentNode } from 'graphql';
import { default as defaults } from './defaults';

const typeDefs: DocumentNode = require('./schema.gql');

export const stateLink = createLinkWithCache(cache => withClientState({ cache, resolvers, defaults, typeDefs }));
