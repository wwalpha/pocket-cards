import { DynamoDB } from 'aws-sdk';
import {
  APIGatewayAuthorizerResult,
  APIGatewayEventRequestContextV2,
  APIGatewayRequestAuthorizerEventV2,
} from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';
import winston from 'winston';
import omit from 'lodash/omit';
import { decodeToken, getPublicKeys, validateToken } from './utils';
import { Environments } from './consts';
import { ApiOptions, AuthPolicy } from './AuthPolicy';
import { Tables } from 'typings';

const PEM_KEYS: Record<string, Record<string, string>> = {};
const API_KEYS: string[] = [];
const Logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'authorizer' },
  transports: [new winston.transports.Console()],
});

const client = new DynamoDB.DocumentClient({
  region: process.env.AWS_DEFAULT_REGION,
});

export const handler = async (event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewayAuthorizerResult> => {
  Logger.info('event', omit(event, ['identitySource', 'headers.authorization']));

  // authorizator token
  let identitySource: string | undefined = undefined;

  // websocket
  if (event.headers?.['Sec-WebSocket-Key'] !== undefined) {
    identitySource = event.queryStringParameters?.['Authorization'];
  } else {
    // http api
    identitySource = event.identitySource[0];
  }

  // validation
  if (!identitySource) {
    return authorizationFailure();
  }

  // if (event.headers['x-api-key']) {
  //   if (API_KEYS.length === 0) {
  //     const result = await helper.get<Tables.Settings.APIKey>({
  //       TableName: Environments.TABLE_NAME_SETTINGS,
  //       Key: {
  //         Id: 'API_KEY',
  //       } as Tables.Settings.Key,
  //     });

  //     result?.Item?.Keys.forEach((item) => API_KEYS.push(item));
  //   }

  //   return { isAuthorized: API_KEYS.includes(identitySource) };
  // }

  try {
    const decodedToken = decodeToken(identitySource);

    const token = decodedToken;
    const payload = token.payload as JwtPayload;
    const iss = payload.iss;
    const kid = token.header.kid;

    // iss not exist
    if (!iss || !kid) {
      return authorizationFailure();
    }

    let pems: Record<string, string> | undefined = PEM_KEYS[iss];

    // not cached
    if (!pems) {
      // get public keys
      pems = await getPublicKeys(iss);
      // cache
      PEM_KEYS[iss] = pems;
    }

    // validate token
    validateToken(pems, identitySource);

    // principalId
    const principalId = payload['cognito:username'];
    // policy
    const policy = await getPolicy(event, principalId);

    console.log(JSON.stringify(policy));

    return policy;
  } catch (err) {
    console.log(err);

    return authorizationFailure();
  }
};

/** get user policy */
const getPolicy = async (
  event: APIGatewayRequestAuthorizerEventV2,
  principalId: string
): Promise<APIGatewayAuthorizerResult> => {
  let policy: APIGatewayAuthorizerResult = {
    principalId: '*',
    policyDocument: {
      Version: '*',
      Statement: [],
    },
  };

  // websocket
  if (event.headers?.['Sec-WebSocket-Key'] !== undefined) {
    policy = await buildWSSAuthPolicy(event.requestContext, principalId);
  } else {
    policy = await buildAuthPolicy(event, principalId);
  }

  policy.context = {
    userId: principalId,
  };

  return policy;
};

/**
 * Build IAM Policy
 *
 * @param event event
 * @param principalId user id
 * @returns
 */
const buildAuthPolicy = async (
  event: APIGatewayRequestAuthorizerEventV2,
  principalId: string
): Promise<APIGatewayAuthorizerResult> => {
  const apiOptions: ApiOptions = {};
  const infos = event.routeArn.split(':');
  const region = infos[3];
  const { accountId, apiId, stage } = event.requestContext;

  apiOptions.region = region;
  apiOptions.restApiId = apiId;
  apiOptions.stage = stage;

  const policy = new AuthPolicy(principalId, accountId, apiOptions);
  const authority = await getUserRole(principalId);

  console.log('authority', authority);
  console.log('principalId', principalId);

  switch (authority) {
    case 'TENANT_ADMIN':
      policy.allowMethod(AuthPolicy.HttpVerb.ALL, '/admin/*');
      policy.allowMethod(AuthPolicy.HttpVerb.GET, '/groups');
      policy.allowMethod(AuthPolicy.HttpVerb.POST, '/groups');
      policy.allowMethod(AuthPolicy.HttpVerb.ALL, '/groups/*');

      break;
    case 'PARENT':
      policy.allowMethod(AuthPolicy.HttpVerb.GET, '/groups');
      policy.allowMethod(AuthPolicy.HttpVerb.DELETE, '/groups/*');
      policy.allowMethod(AuthPolicy.HttpVerb.GET, '/groups/*/questions');
      policy.allowMethod(AuthPolicy.HttpVerb.GET, '/curriculums');
      policy.allowMethod(AuthPolicy.HttpVerb.POST, '/curriculums');
      policy.allowMethod(AuthPolicy.HttpVerb.ALL, '/curriculums/*');
      policy.allowMethod(AuthPolicy.HttpVerb.ALL, '/users/*');
      policy.allowMethod(AuthPolicy.HttpVerb.POST, '/study/weekly');
      policy.allowMethod(AuthPolicy.HttpVerb.ALL, '/study/weekly/*');
      break;
    case 'STUDENT':
      policy.allowAllMethods();
      break;
    default:
      policy.denyAllMethods();
  }

  return policy.build();
};

/**
 * Build IAM Policy
 *
 * @param context context
 * @param principalId user id
 * @returns
 */
const buildWSSAuthPolicy = async (
  context: APIGatewayEventRequestContextV2,
  principalId: string
): Promise<APIGatewayAuthorizerResult> => {
  const apiOptions: ApiOptions = {};
  const infos = context.domainName.split('.');
  const region = infos[2];
  const { apiId, stage } = context;

  apiOptions.region = region;
  apiOptions.restApiId = apiId;
  apiOptions.stage = stage;

  const policy = new AuthPolicy(principalId, '*', apiOptions);
  const authority = await getUserRole(principalId);

  console.log('authority', authority);
  console.log('principalId', principalId);

  switch (authority) {
    case 'TENANT_ADMIN':
      policy.allowAllMethods();
      break;

    case 'PARENT':
      policy.allowAllMethods();
      break;

    case 'STUDENT':
      policy.allowAllMethods();
      break;

    default:
      policy.denyAllMethods();
  }

  return policy.build();
};

const getUserRole = async (userId: string): Promise<string> => {
  // get user role from db
  const result = await client
    .get({
      TableName: Environments.TABLE_NAME_USERS,
      Key: {
        id: userId,
      } as Tables.TUsersKey,
    })
    .promise();

  const userInfo = result.Item;

  // user not found
  if (!userInfo) return '';

  return (userInfo as Tables.TUsers).authority;
};

/**
 * Authorize failure
 * @returns
 */
const authorizationFailure = (): APIGatewayAuthorizerResult => {
  const policy = new AuthPolicy('*', '*');
  policy.denyAllMethods();

  return policy.build();
};
