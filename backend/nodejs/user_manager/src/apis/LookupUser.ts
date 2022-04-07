import express from 'express';
import { lookupUserPoolData } from '@cognito';
import { Logger } from '@utils';
import { Users } from 'typings';

/**
 * lookup user in cognito
 *
 * @param req request
 */
export const LookupUser = async (req: express.Request): Promise<Users.LookupUserResponse> => {
  Logger.debug('Looking up user pool data for: ' + req.params.id);

  // find user in user pool
  const user = await lookupUserPoolData(req.params.id);

  // lookup user response
  return {
    isExist: user !== undefined,
    authority: user?.Authority,
    identityPoolId: user?.IdentityPoolId,
    userPoolId: user?.UserPoolId,
    clientId: user?.ClientId,
  };
};
