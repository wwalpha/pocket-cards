import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';
import winston from 'winston';
import omit from 'lodash/omit';
import { decodeToken, getPublicKeys, validateToken } from './utils';
import { ApiOptions, AuthPolicy } from './AuthPolicy';

const PEM_KEYS: Record<string, Record<string, string>> = {};
const API_KEYS: string[] = [];
const Logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'authorizer' },
  transports: [new winston.transports.Console()],
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
    const policy = buildWSSAuthPolicy(event, principalId);

    policy.context = {
      userId: principalId,
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
const buildWSSAuthPolicy = (
  event: APIGatewayRequestAuthorizerEvent,
  principalId: string
): APIGatewayAuthorizerResult => {
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