import { DynamoDB } from 'aws-sdk';
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';
import winston from 'winston';
import omit from 'lodash/omit';
import { decodeToken, getPublicKeys, validateToken } from './utils';
import { ApiOptions, AuthPolicy } from './AuthPolicy';
import { Tables } from 'typings';

const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS as string;
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

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  Logger.info('event', omit(event, ['identitySource', 'headers.authorization']));

  // authorizator token
  let identitySource: string | undefined = event.queryStringParameters?.['Authorization'];

  // validation
  if (!identitySource) {
    return authorizationFailure();
  }

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
    const policy = buildAuthPolicy(event, principalId);

    const guadian = await getGuardian(principalId);

    policy.context = {
      guadian: guadian,
    };

    console.log(JSON.stringify(policy));

    return policy;
  } catch (err) {
    console.log(err);

    return authorizationFailure();
  }
};

/**
 * Build IAM Policy
 *
 * @param event event
 * @param principalId user id
 * @returns
 */
const buildAuthPolicy = (event: APIGatewayRequestAuthorizerEvent, principalId: string): APIGatewayAuthorizerResult => {
  const apiOptions: ApiOptions = {};
  const infos = event.methodArn.split(':');
  const region = infos[3];
  const accountId = infos[4];
  const { apiId, stage } = event.requestContext;

  apiOptions.region = region;
  apiOptions.restApiId = apiId;
  apiOptions.stage = stage;

  const policy = new AuthPolicy(principalId, accountId, apiOptions);

  console.log('principalId', principalId);

  policy.allowMethod(AuthPolicy.HttpVerb.GET, event.methodArn);

  return policy.build();
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

const getGuardian = async (userId: string): Promise<string | undefined> => {
  // get user role from db
  const result = await client
    .get({
      TableName: TABLE_NAME_USERS,
      Key: {
        id: userId,
      } as Tables.TUsersKey,
    })
    .promise();

  // user not found
  if (!result.Item) return undefined;

  const userInfo = result.Item as Tables.TUsers;

  return userInfo.teacher ? userInfo.teacher : userInfo.id;
};
